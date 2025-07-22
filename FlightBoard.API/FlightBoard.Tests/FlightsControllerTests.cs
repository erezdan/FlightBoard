using System.Net;
using System.Net.Http.Json;
using FlightBoard.Domain.Entities;
using FlightBoard.API.Hubs;
using FlightBoard.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using Xunit;

namespace FlightBoard.Tests.Controllers;

public class FlightsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly FlightDbContext _db;
    private readonly Mock<IHubContext<FlightHub>> _hubMock;

    public FlightsControllerTests(WebApplicationFactory<Program> factory)
    {
        _hubMock = new Mock<IHubContext<FlightHub>>();

        var sqliteFactory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove background service
                var hostedServiceDescriptor = services.FirstOrDefault(
                    d => d.ImplementationType?.Name == "FlightStatusBackgroundService");
                if (hostedServiceDescriptor != null)
                    services.Remove(hostedServiceDescriptor);

                // Replace DbContext with shared in-memory SQLite
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<FlightDbContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                services.AddDbContext<FlightDbContext>(options =>
                {
                    options.UseSqlite("DataSource=file:memdb?mode=memory&cache=shared");
                });

                // Replace IHubContext with a mock
                services.RemoveAll<IHubContext<FlightHub>>();
                services.AddSingleton<IHubContext<FlightHub>>(_hubMock.Object);

                // Initialize database
                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<FlightDbContext>();
                db.Database.OpenConnection();
                db.Database.EnsureCreated();
            });
        });

        _client = sqliteFactory.CreateClient();
        _db = sqliteFactory.Services.CreateScope().ServiceProvider.GetRequiredService<FlightDbContext>();
    }

    [Fact]
    public async Task GetAll_ReturnsSuccessStatusCode()
    {
        var flight = new Flight
        {
            FlightNumber = "TEST-GET-01",
            Destination = "Tokyo",
            DepartureTime = DateTime.UtcNow.AddHours(1),
            Gate = "Z1",
            Status = "boarding"
        };
        _db.Flights.Add(flight);
        await _db.SaveChangesAsync();

        var response = await _client.GetAsync("/api/flights");
        var content = await response.Content.ReadAsStringAsync();
        if (response.StatusCode != HttpStatusCode.OK)
        {
            throw new Exception($"Unexpected status code: {response.StatusCode}\nResponse Body:\n{content}");
        }

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task PostFlight_WithPastDepartureTime_ReturnsBadRequest()
    {
        var flight = new Flight
        {
            FlightNumber = "TEST-001",
            Destination = "Paris",
            DepartureTime = DateTime.UtcNow.AddMinutes(-10),
            Gate = "A1",
            Status = "scheduled"
        };

        var response = await _client.PostAsJsonAsync("/api/flights", flight);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PostFlight_WithValidFlight_ReturnsOk()
    {
        var flight = new Flight
        {
            FlightNumber = "TEST-002",
            Destination = "London",
            DepartureTime = DateTime.UtcNow.AddHours(1),
            Gate = "A2",
            Status = "boarding"
        };

        var response = await _client.PostAsJsonAsync("/api/flights", flight);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task SearchFlights_ByDestination_ReturnsResult()
    {
        var flight = new Flight
        {
            FlightNumber = "TEST-003",
            Destination = "Berlin",
            DepartureTime = DateTime.UtcNow.AddHours(1),
            Gate = "C1",
            Status = "scheduled"
        };
        _db.Flights.Add(flight);
        await _db.SaveChangesAsync();

        var response = await _client.GetAsync("/api/flights/search?destination=berlin");
        var result = await response.Content.ReadFromJsonAsync<List<Flight>>();

        Assert.NotNull(result);
        Assert.Single(result);
    }

    [Fact]
    public async Task DeleteFlight_RemovesFlight()
    {
        var flight = new Flight
        {
            FlightNumber = "TEST-004",
            Destination = "Rome",
            DepartureTime = DateTime.UtcNow.AddHours(1),
            Gate = "D1",
            Status = "scheduled"
        };
        _db.Flights.Add(flight);
        await _db.SaveChangesAsync();

        var response = await _client.DeleteAsync($"/api/flights/{flight.Id}");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task PostFlight_WithoutFlightNumber_ReturnsBadRequest()
    {
        var flight = new Flight
        {
            FlightNumber = null,
            Destination = "Madrid",
            DepartureTime = DateTime.UtcNow.AddHours(1),
            Gate = "A5",
            Status = "scheduled"
        };

        var response = await _client.PostAsJsonAsync("/api/flights", flight);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PostFlight_WithoutGate_ReturnsBadRequest()
    {
        var flight = new Flight
        {
            FlightNumber = "TEST-005",
            Destination = "Athens",
            DepartureTime = DateTime.UtcNow.AddHours(2),
            Gate = null,
            Status = "scheduled"
        };

        var response = await _client.PostAsJsonAsync("/api/flights", flight);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PostFlight_WithDuplicateFlightNumber_ReturnsConflict()
    {
        var existingFlight = new Flight
        {
            FlightNumber = "TEST-006",
            Destination = "Oslo",
            DepartureTime = DateTime.UtcNow.AddHours(1),
            Gate = "G1",
            Status = "scheduled"
        };
        _db.Flights.Add(existingFlight);
        await _db.SaveChangesAsync();

        var duplicateFlight = new Flight
        {
            FlightNumber = "TEST-006",
            Destination = "Copenhagen",
            DepartureTime = DateTime.UtcNow.AddHours(2),
            Gate = "G2",
            Status = "delayed"
        };

        var response = await _client.PostAsJsonAsync("/api/flights", duplicateFlight);
        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task SearchFlights_WithNoMatchingResults_ReturnsEmpty()
    {
        var response = await _client.GetAsync("/api/flights/search?destination=nowhere");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var results = await response.Content.ReadFromJsonAsync<List<Flight>>();
        Assert.NotNull(results);
        Assert.Empty(results);
    }

    [Fact]
    public async Task PostFlight_TriggersSignalRBroadcast()
    {
        var flight = new Flight
        {
            FlightNumber = "TEST-007",
            Destination = "Lisbon",
            DepartureTime = DateTime.UtcNow.AddHours(1),
            Gate = "B1",
            Status = "scheduled"
        };

        var response = await _client.PostAsJsonAsync("/api/flights", flight);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        _hubMock.Verify(
            h => h.Clients.All.SendAsync("FlightAdded", It.IsAny<Flight>(), default),
            Times.Once);
    }
}
