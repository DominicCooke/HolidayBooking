using System.Threading.Tasks;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.DataAccess.Repositories;
using Microsoft.AspNet.Identity;

namespace GWHolidayBookingWeb.Services.Identity
{
    public class IdentityService : IIdentityService
    {
        private readonly IIdentityRepository identityRepository;

        public IdentityService(IIdentityRepository identityRepository)
        {
            this.identityRepository = identityRepository;
        }

        public Task<IdentityResult> RegisterEmployee(EmployeeCreateViewModel identityEmployeeCreateViewModel)
        {
            return identityRepository.RegisterEmployee(identityEmployeeCreateViewModel);
        }

        public void Dispose()
        {
            identityRepository.Dispose();
        }
    }
}