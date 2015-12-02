using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public class PublicHoliday
    {
        [Key]
        public Guid PublicHolidayId { get; set; }
        public DateTime Date { get; set; }
    }
}