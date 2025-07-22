using FlightBoard.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using FlightBoard.API.Hubs;
using System.Text.Json;
using FlightBoard.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddDbContext<FlightDbContext>(options =>
    options.UseSqlite("Data Source=flights.db"));

builder.Services.AddSignalR();
builder.Services.AddHostedService<FlightStatusBackgroundService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();
app.UseCors();

// Middleware
app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();
app.UseAuthorization();

app.MapControllers();
app.MapHub<FlightHub>("/flightHub");

app.Run();

public partial class Program { }
