using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using GWHolidayBookingWeb.Models.Identity_Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GWHolidayBookingWeb.Models.Services
{
    public interface IAuthService
    {
        Task<IdentityResult> RegisterUser(UserModel userModel);
        void Dispose();
    }
}