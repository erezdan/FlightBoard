using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FlightBoard.Domain.Helpers;

namespace FlightBoard.Domain.Entities
{
    public class Flight
    {
        public int Id { get; set; }
        public string FlightNumber { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime DepartureTime { get; set; }
        public string Gate { get; set; } = string.Empty;

        public string Status => FlightStatusHelper.CalculateStatus(DepartureTime);
    }
}
