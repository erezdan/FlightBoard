using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SignalR;
using FlightBoard.Infrastructure.Persistence;
using FlightBoard.API.Hubs;
using FlightBoard.Domain.Entities;
using FlightBoard.Domain.Helpers;
using Microsoft.EntityFrameworkCore;

namespace FlightBoard.API.Services;

public class FlightStatusBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IHubContext<FlightHub> _hubContext;
    private readonly TimeSpan _interval = TimeSpan.FromSeconds(30);

    public FlightStatusBackgroundService(IServiceProvider serviceProvider, IHubContext<FlightHub> hubContext)
    {
        _serviceProvider = serviceProvider;
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<FlightDbContext>();
            var now = DateTime.UtcNow;

            // We include flights whose departure time is up to 65 minutes ago,
            // to ensure we can detect the transition from "Departed" to "Landed".
            // Also include flights scheduled within the next 24 hours.
            var flights = await db.Flights
                .Where(f => f.DepartureTime >= now.AddMinutes(-65) &&
                            f.DepartureTime <= now.AddHours(24))
                .AsNoTracking()
                .ToListAsync(stoppingToken);

            foreach (var flight in flights)
            {
                var calculatedStatus = FlightStatusHelper.CalculateStatus(flight.DepartureTime);

                if (flight.Status != calculatedStatus)
                {
                    // Update only if status has changed
                    flight.Status = calculatedStatus;
                    db.Flights.Update(flight);
                    await db.SaveChangesAsync(stoppingToken);

                    // Notify clients via SignalR
                    await _hubContext.Clients.All.SendAsync("FlightStatusUpdated", flight, cancellationToken: stoppingToken);
                }
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }
}
