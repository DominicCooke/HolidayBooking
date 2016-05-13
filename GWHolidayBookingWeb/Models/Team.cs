using System;
using System.ComponentModel.DataAnnotations;

namespace GWHolidayBookingWeb.Models
{
    public class Team
    {
        [Key]
        public Guid TeamId { get; set; }

        public string TeamName { get; set; }
    }
}