using System.Collections.Generic;
using GWHolidayBookingWeb.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GWHolidayBookingWeb.DataAccess.ViewModels
{
    public class GetUsersAndRolesViewModel
    {
        public List<UpdateEmployeeViewModel> ListOfCalendarViewModels { get; set; }
        public List<IdentityRole> ListOfIdentityRoles { get; set; }
        public List<Team> ListOfTeams { get; set; } 
    }
}