using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public class UserContext : DbContext, IUserContext
    {
        public UserContext() : base("ConnStringDb1")
        {}
        public DbSet<User> Users { get; set; }
        public virtual DbSet<HolidayBooking> HolidayBookings { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}