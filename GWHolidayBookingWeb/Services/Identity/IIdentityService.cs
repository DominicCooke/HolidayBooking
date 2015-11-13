using System.Threading.Tasks;
using GWHolidayBookingWeb.DataAccess.Identity;
using Microsoft.AspNet.Identity;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Services.Identity
{
    public interface IIdentityService
    {
        Task<IdentityResult> RegisterEmployee(IdentityEmployee identityEmployee);
        void Dispose();
    }
}