using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public class HolidayBooking
    {
        [Key]
        public int HolidayId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int AllowanceDays { get; set; }
        public BookingStatusEnum BookingStatus { get; set; }

    }

    public enum BookingStatusEnum
    {
        Pending = 0,
        Confirmed = 1,
        Cancelled = 2
    }
}