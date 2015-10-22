using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public class UserContext : DbContext
    {
        public UserContext()
            : base("ConnStringDb1")
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<HolidayBooking> HolidayBookings { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}