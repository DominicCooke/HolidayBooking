using System.Collections.Generic;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GWHolidayBookingWeb.DataAccess.ViewModels
{
    public class IdentityUserViewModel
    {
        public string IdentityId { get; set; }
        public string Username { get; set; }
        public List<IdentityRole> RoleViewModels { get; set; }
    }
}