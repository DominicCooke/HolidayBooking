using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GWHolidayBookingWeb.DataAccess.Identity
{
    public class IdentityEmployee : IdentityUser
    {
        [Required]
        public Guid StaffId { get; set; }
    }
}