using Microsoft.AspNet.Identity.EntityFramework;

namespace GWHolidayBookingWeb.DataAccess.Identity
{
    public class AuthContext : IdentityDbContext<IdentityUser>, IAuthContext
    {
        public AuthContext()
            : base("ConnStringDb1")
        {
        }
    }
}