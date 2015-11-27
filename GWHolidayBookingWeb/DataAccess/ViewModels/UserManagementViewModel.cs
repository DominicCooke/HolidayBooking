using System.Collections.Generic;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GWHolidayBookingWeb.DataAccess.ViewModels
{
    public class UserManagementViewModel
    {
        public List<EmployeeCalendarViewModel> ListOfCalendarViewModels { get; set; }
        public List<IdentityRole> ListOfIdentityRoles { get; set; }
    }
}