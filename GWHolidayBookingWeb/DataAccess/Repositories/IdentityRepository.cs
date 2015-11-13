using System.Threading.Tasks;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using AutoMapper;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public class IdentityRepository : IIdentityRepository
    {
        private readonly IIdentityContext context;
        private readonly UserManager<IdentityEmployee> userManager;

        public IdentityRepository(IdentityContext context)
        {
            this.context = context;
            userManager = new UserManager<IdentityEmployee>(new UserStore<IdentityEmployee>(context));
        }

        public async Task<IdentityResult> RegisterEmployee(IdentityEmployee identityEmployee)
        {
            var user = new IdentityEmployee
            {
                UserName = identityEmployee.UserName
            };
            IdentityResult result = await userManager.CreateAsync(user, "123123");
            return result;
        }

        public async Task<IdentityEmployee> FindEmployee(string userName, string password)
        {
            return await userManager.FindAsync(userName, password);
        }

        public void Dispose()
        {
            context.Dispose();
            userManager.Dispose();
        }
    }
}