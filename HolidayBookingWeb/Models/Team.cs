using System;
using System.ComponentModel.DataAnnotations;

namespace HolidayBookingWeb.Models
{
    public class Team
    {
        [Key]
        public Guid TeamId { get; set; }
        public string TeamName { get; set; }
    }
}