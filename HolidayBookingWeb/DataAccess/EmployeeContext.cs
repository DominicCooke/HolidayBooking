using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using HolidayBookingWeb.Models;

namespace HolidayBookingWeb.DataAccess
{
    public class EmployeeContext : DbContext, IEmployeeContext
    {
        public EmployeeContext()
            : base("ConnStringDb1")
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public virtual DbSet<EmployeeHolidayBooking> HolidayBookings { get; set; }
        public DbSet<PublicHoliday> PublicHolidays { get; set; }
        public DbSet<Team> Teams { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}