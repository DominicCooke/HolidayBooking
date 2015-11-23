using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.DataAccess.Identity.ViewModels
{
    public class EmployeeDeleteViewModel
    {
        public Guid StaffId { get; set; }
        public string IdentityId { get; set; }
    }
}