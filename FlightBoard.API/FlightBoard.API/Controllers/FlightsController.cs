using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using FlightBoard.Infrastructure.Persistence;
using FlightBoard.API.Hubs;
using FlightBoard.Domain.Entities;

namespace FlightBoard.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlightsController : ControllerBase
{
    private readonly FlightDbContext _db;
    private readonly IHubContext<FlightHub> _hub;

    public FlightsController(FlightDbContext db, IHubContext<FlightHub> hub)
    {
        _db = db;
        _hub = hub;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_db.Flights.ToList());

    [HttpPost]
    public async Task<IActionResult> AddFlight([FromBody] Flight flight)
    {
        if (flight.DepartureTime <= DateTime.UtcNow)
            return BadRequest("Departure time must be in the future.");

        _db.Flights.Add(flight);
        await _db.SaveChangesAsync();

        await _hub.Clients.All.SendAsync("FlightAdded", flight);

        return Ok(flight);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFlight(int id)
    {
        var flight = await _db.Flights.FindAsync(id);
        if (flight == null)
            return NotFound();

        _db.Flights.Remove(flight);
        await _db.SaveChangesAsync();

        await _hub.Clients.All.SendAsync("FlightDeleted", id);

        return NoContent();
    }
}
