using System.Threading.Tasks;
using GWHolidayBookingWeb.DataAccess.Identity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly IAuthContext context;
        private UserManager<IdentityUser> userManager;

        public AuthRepository(AuthContext context)
        {
            this.context = context;
            userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(context));
        }

        public async Task<IdentityResult> RegisterUser(UserModel userModel)
        {
            IdentityUser user = new IdentityUser
            {
                UserName = userModel.UserName
            };
            var result = await userManager.CreateAsync(user, userModel.Password);
            return result;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            IdentityUser user = await userManager.FindAsync(userName, password);
            return user;
        }

        public void Dispose()
        {
            context.Dispose();
            userManager.Dispose();
        }
    }
}