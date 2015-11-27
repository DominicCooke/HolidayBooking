using System;
using System.Collections.Generic;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess.ViewModels
{
    public class GetEmployeeByIdViewModel
    {
        public Guid StaffId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int HolidayAllowance { get; set; }
        public int RemainingAllowance { get; set; }
        public virtual ICollection<EmployeeHolidayBooking> HolidayBookings { get; set; }
        public string RoleName { get; set; }
    }
}