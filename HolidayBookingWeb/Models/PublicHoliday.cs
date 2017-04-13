using System;
using System.ComponentModel.DataAnnotations;

namespace HolidayBookingWeb.Models
{
    public class PublicHoliday
    {
        [Key]
        public Guid PublicHolidayId { get; set; }
        public DateTime Date { get; set; }
    }
}