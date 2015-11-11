using System.Data.Entity;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess
{
    public interface IUserContext : IDbContext
    {
        DbSet<UserData> Users { get; set; }
        DbSet<HolidayBooking> HolidayBookings { get; set; }
    }
}