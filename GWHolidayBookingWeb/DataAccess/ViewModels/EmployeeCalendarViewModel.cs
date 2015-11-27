using System;

namespace GWHolidayBookingWeb.DataAccess.ViewModels
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