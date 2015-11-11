using System.Threading.Tasks;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.DataAccess.Repositories;
using Microsoft.AspNet.Identity;

namespace GWHolidayBookingWeb.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository authRepository;

        public AuthService(IAuthRepository authRepository)
        {
            this.authRepository = authRepository;
        }

        public Task<IdentityResult> RegisterUser(UserModel userModel)
        {
            return authRepository.RegisterUser(userModel);
        }

        public void Dispose()
        {
            authRepository.Dispose();
        }
    }
}