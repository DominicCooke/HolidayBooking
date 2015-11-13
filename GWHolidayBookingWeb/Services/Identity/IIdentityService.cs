using System.Threading.Tasks;
using GWHolidayBookingWeb.DataAccess.Identity;
using Microsoft.AspNet.Identity;

namespace GWHolidayBookingWeb.Services.Identity
{
    public interface IIdentityService
    {
        Task<IdentityResult> RegisterEmployee(EmployeeCreateViewModel identityEmployeeCreateViewModel);
        void Dispose();
    }
}