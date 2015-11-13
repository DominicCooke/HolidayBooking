using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.ComponentModel.DataAnnotations;

namespace GWHolidayBookingWeb.DataAccess.Identity
{
    public class IdentityEmployee : IdentityUser
    {
        [Required]
        public Guid StaffId { get; set; }
    }
}