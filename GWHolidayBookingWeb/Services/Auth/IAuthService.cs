using System.Threading.Tasks;
using GWHolidayBookingWeb.DataAccess.Identity;
using Microsoft.AspNet.Identity;

namespace GWHolidayBookingWeb.Services.Auth
{
    public interface IAuthService
    {
        Task<IdentityResult> RegisterUser(UserModel userModel);
        void Dispose();
    }
}