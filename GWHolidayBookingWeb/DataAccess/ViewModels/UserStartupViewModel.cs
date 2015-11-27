using System;
using System.Collections.Generic;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess.ViewModels
{
    public class UserStartupViewModel
    {
        public Guid StaffId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int HolidayAllowance { get; set; }
        public int RemainingAllowance { get; set; }
        public virtual ICollection<EmployeeCalendarHoldiayBooking> HolidayBookings { get; set; }
        public string RoleName { get; set; }
    }
}