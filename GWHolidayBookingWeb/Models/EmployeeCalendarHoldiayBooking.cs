using System;
using System.ComponentModel.DataAnnotations;

namespace GWHolidayBookingWeb.Models
{
    public class EmployeeCalendarHoldiayBooking
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