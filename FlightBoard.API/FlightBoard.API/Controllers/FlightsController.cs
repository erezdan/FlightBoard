using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using FlightBoard.Infrastructure.Persistence;
using FlightBoard.API.Hubs;
using FlightBoard.Domain.Entities;
using Microsoft.EntityFrameworkCore;

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
    public async Task<IActionResult> GetAll()
    {
        var flights = await _db.Flights.ToListAsync();
        return Ok(flights);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Flight>>> SearchFlights(
    [FromQuery] string? status,
    [FromQuery] string? destination)
    {
        var query = _db.Flights.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(f => f.Status.ToLower() == status.ToLower());

        if (!string.IsNullOrEmpty(destination))
            query = query.Where(f => f.Destination.ToLower().Contains(destination.ToLower()));

        var result = await query.ToListAsync();
        return Ok(result);
    }

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
