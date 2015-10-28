using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public interface IDbContext
    {
        int SaveChanges();

        DbEntityEntry Entry(dynamic model);

        void Dispose();
    }
}