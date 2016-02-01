using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public class Team
    {
        [Key]
        public Guid TeamId { get; set; }
        public string TeamName { get; set; }
    }
}