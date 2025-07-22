using FlightBoard.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using FlightBoard.API.Hubs;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddDbContext<FlightDbContext>(options =>
    options.UseSqlite("Data Source=flights.db"));

builder.Services.AddSignalR();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware
app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();
app.UseAuthorization();

app.MapControllers();
app.MapHub<FlightHub>("/flighthub");

app.Run();
