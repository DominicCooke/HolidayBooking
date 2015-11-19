using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GWHolidayBookingWeb.Models;
using GWHol.Web.ViewModels;

namespace GWHolidayBookingWeb.DataAccess.Identity
{
    public class EmployeeCalendarViewModel
    {
        public Guid StaffId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int HolidayAllowance { get; set; }
        public int RemainingAllowance { get; set; }
        public IdentityUserViewModel UserViewModel { get; set; }
    }
}