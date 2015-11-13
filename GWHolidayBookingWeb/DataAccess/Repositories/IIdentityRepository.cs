using System;
using System.Threading.Tasks;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public interface IIdentityRepository : IDisposable
    {
        Task<IdentityResult> RegisterEmployee(IdentityEmployee identityEmployee);
        Task<IdentityEmployee> FindEmployee(string userName, string password);
    }
}