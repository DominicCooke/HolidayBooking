using System.Data.Entity;
using HolidayBookingWeb.Models;

namespace HolidayBookingWeb.DataAccess
{
    public interface IEmployeeContext : IDbContext
    {
        DbSet<Employee> Employees { get; set; }
        DbSet<EmployeeHolidayBooking> HolidayBookings { get; set; }
        DbSet<PublicHoliday> PublicHolidays { get; set; }
        DbSet<Team> Teams { get; set; }
    }
}