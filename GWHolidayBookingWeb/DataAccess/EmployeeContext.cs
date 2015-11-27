using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess
{
    public class EmployeeContext : DbContext, IEmployeeContext
    {
        public EmployeeContext()
            : base("ConnStringDb1")
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public virtual DbSet<EmployeeHolidayBooking> HolidayBookings { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}