using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlightBoard.Domain.Helpers
{
    public static class FlightStatusHelper
    {
        public static string CalculateStatus(DateTime departureTime)
        {
            var now = DateTime.UtcNow;
            var diff = departureTime - now;

            if (diff > TimeSpan.FromMinutes(30))
                return "Scheduled";
            if (diff <= TimeSpan.FromMinutes(30) && diff > TimeSpan.Zero)
                return "Boarding";
            if (now <= departureTime.AddHours(1))
                return "Departed";
            return "Landed";
        }
    }
}
