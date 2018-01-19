using System.Data.Common;
using Microsoft.AspNet.Identity.EntityFramework;

namespace HolidayBookingWeb.DataAccess.Identity
{
    public interface IIdentityContext : IDbContext
    {
    }
    
    public class IdentityContext : IdentityDbContext<IdentityEmployee>, IIdentityContext
    {
        public IdentityContext()
            : base("ConnStringDb1")
        {
            Configuration.LazyLoadingEnabled = true;
        }

        public IdentityContext(DbConnection connection)
            : base(connection, true)
        {
        }
    }
}