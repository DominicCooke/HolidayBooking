using System.Data.Entity.Infrastructure;

namespace GWHolidayBookingWeb.DataAccess
{
    public interface IDbContext
    {
        int SaveChanges();

        DbEntityEntry Entry(dynamic model);

        void Dispose();
    }
}