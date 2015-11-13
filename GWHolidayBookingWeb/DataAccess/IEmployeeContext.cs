using System.Data.Entity;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess
{
    public interface IEmployeeContext : IDbContext
    {
        DbSet<EmployeeCalendar> Employees { get; set; }
        DbSet<EmployeeCalendarHoldiayBooking> HolidayBookings { get; set; }
    }
}