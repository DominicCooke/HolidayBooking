using System.Data.Entity.Infrastructure;

namespace HolidayBookingWeb.DataAccess
{
    public interface IDbContext
    {
        int SaveChanges();

        DbEntityEntry Entry(dynamic model);

        void Dispose();
    }
}