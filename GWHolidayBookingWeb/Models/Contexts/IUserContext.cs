using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models.Contexts
{
    public interface IUserContext : IDbContext
    {
        DbSet<User> Users { get; set; }
        DbSet<HolidayBooking> HolidayBookings { get; set; }
    }
}