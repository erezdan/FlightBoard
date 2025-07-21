using Microsoft.EntityFrameworkCore;
using FlightBoard.Domain.Entities;

namespace FlightBoard.Infrastructure.Persistence;

public class FlightDbContext : DbContext
{
    public DbSet<Flight> Flights => Set<Flight>();

    public FlightDbContext(DbContextOptions<FlightDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Flight>()
            .HasIndex(f => f.FlightNumber)
            .IsUnique();
    }
}
