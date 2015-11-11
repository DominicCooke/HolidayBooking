using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using GWHolidayBookingWeb.Models.Identity_Models;
using GWHolidayBookingWeb.Models.Repositorys;
using Microsoft.AspNet.Identity;

namespace GWHolidayBookingWeb.Models.Services
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