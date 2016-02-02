using GWHolidayBookingWeb.Models;
using System;

namespace GWHolidayBookingWeb.DataAccess.ViewModels
{
    public class UpdateEmployeeViewModel
    {
        public Guid StaffId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int HolidayAllowance { get; set; }
        public int RemainingAllowance { get; set; }
        public TeamViewModel Team { get; set; }
        public IdentityUserViewModel UserViewModel { get; set; }
    }
}