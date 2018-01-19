using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;
using HolidayBookingWeb.Models;

namespace HolidayBookingWeb.DataAccess
{
    public interface IDbContext
    {
        int SaveChanges();

        DbEntityEntry Entry(dynamic model);

        void Dispose();
    }

    public interface IEmployeeContext : IDbContext
    {
        DbSet<Employee> Employees { get; set; }
        DbSet<EmployeeHolidayBooking> HolidayBookings { get; set; }
        DbSet<PublicHoliday> PublicHolidays { get; set; }
        DbSet<Team> Teams { get; set; }
    }

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