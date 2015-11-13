using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using GWHolidayBookingWeb.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GWHolidayBookingWeb.DataAccess
{
    public class EmployeeContext : DbContext, IEmployeeContext
    {
        public EmployeeContext()
            : base("ConnStringDb1")
        {
        }

        public DbSet<EmployeeCalendar> Employees { get; set; }
        public virtual DbSet<EmployeeCalendarHoldiayBooking> HolidayBookings { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}