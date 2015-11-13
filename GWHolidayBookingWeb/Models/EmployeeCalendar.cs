using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GWHolidayBookingWeb.Models
{
    public class EmployeeCalendar
    {
        [Key]
        public Guid StaffId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int HolidayAllowance { get; set; }
        public int RemainingAllowance { get; set; }
        public virtual ICollection<EmployeeCalendarHoldiayBooking> HolidayBookings { get; set; }
    }
}