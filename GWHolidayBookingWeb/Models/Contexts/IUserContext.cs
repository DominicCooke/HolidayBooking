using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public interface IUserContext : IDbContext
    {
        DbSet<User> Users { get; set; }
        DbSet<HolidayBooking> HolidayBookings { get; set; }
    }
}