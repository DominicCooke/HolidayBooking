using System;

namespace GWHolidayBookingWeb.DataAccess.ViewModels
{
    public class RegisterUserAndEmployeeViewModel
    {
        public Guid StaffId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
    }
}