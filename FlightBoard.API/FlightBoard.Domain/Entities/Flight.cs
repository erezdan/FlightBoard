using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using FlightBoard.Domain.Helpers;

namespace FlightBoard.Domain.Entities
{
    [Table("Flights")]
    public class Flight
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("flightNumber")]
        public string FlightNumber { get; set; } = string.Empty;

        [Column("destination")]
        public string Destination { get; set; } = string.Empty;

        [Column("departureTime")]
        public DateTime DepartureTime { get; set; }

        [Column("gate")]
        public string Gate { get; set; } = string.Empty;

        [Column("status")]
        public string Status { get; set; } = string.Empty;
    }
}
