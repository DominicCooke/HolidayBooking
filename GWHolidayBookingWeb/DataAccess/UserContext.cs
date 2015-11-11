using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess
{
    public class UserContext : DbContext, IUserContext
    {
        public UserContext() : base("ConnStringDb1")
        {}
        public DbSet<UserData> Users { get; set; }
        public virtual DbSet<HolidayBooking> HolidayBookings { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}