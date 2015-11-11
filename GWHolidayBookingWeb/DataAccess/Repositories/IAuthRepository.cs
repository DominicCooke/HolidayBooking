using System;
using System.Threading.Tasks;
using GWHolidayBookingWeb.DataAccess.Identity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public interface IAuthRepository : IDisposable
    {
        Task<IdentityResult> RegisterUser(UserModel userModel);
        Task<IdentityUser> FindUser(string userName, string password);
    }
}