using System.Collections.Generic;
using HolidayBookingWeb.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace HolidayBookingWeb.DataAccess.ViewModels
{
    public class GetUsersAndRolesViewModel
    {
        public List<UpdateEmployeeViewModel> ListOfCalendarViewModels { get; set; }
        public List<IdentityRole> ListOfIdentityRoles { get; set; }
        public List<Team> ListOfTeams { get; set; }
    }
}