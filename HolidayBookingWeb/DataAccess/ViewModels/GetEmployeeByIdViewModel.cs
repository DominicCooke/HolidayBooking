using System;
using System.Collections.Generic;
using HolidayBookingWeb.Models;

namespace HolidayBookingWeb.DataAccess.ViewModels
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
        public Guid TeamId { get; set; }
        public string TeamName { get; set; }
    }
}