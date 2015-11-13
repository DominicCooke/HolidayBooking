using System;
using System.Threading.Tasks;
using GWHolidayBookingWeb.DataAccess.Identity;
using Microsoft.AspNet.Identity;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public interface IIdentityRepository : IDisposable
    {
        Task<IdentityResult> RegisterEmployee(EmployeeCreateViewModel identityEmployeeCreateViewModel);
        Task<IdentityEmployee> FindEmployee(string userName, string password);
    }
}