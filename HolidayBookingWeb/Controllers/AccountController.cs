using System.Security.Claims;
using System.Web;
using System.Web.Http;
using HolidayBookingWeb.DataAccess.Identity;
using HolidayBookingWeb.DataAccess.ViewModels;
using Microsoft.AspNet.Identity;

namespace HolidayBookingWeb.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private readonly UserManager<IdentityEmployee> userManager;

        public AccountController() : this(Startup.UserManagerFactory.Invoke())
        {
        }

        public AccountController(UserManager<IdentityEmployee> userManager)
        {
            this.userManager = userManager;
        }

        [Route("Login")]
        [AllowAnonymous]
        [HttpPost]
        public bool Login(LoginViewModel loginViewModel)
        {
            var user = userManager.Find(loginViewModel.username, loginViewModel.password);
            if (user == null)
            {
                return false;
            }
            Authorise(user);
            return true;
        }

        private void Authorise(IdentityEmployee user)
        {
            var identity = new ClaimsIdentity(DefaultAuthenticationTypes.ApplicationCookie);

            identity.AddClaim(new Claim("id", user.StaffId.ToString()));
            identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
            var listOfRoles = userManager.GetRoles(user.Id);
            if (listOfRoles.Contains("admin"))
            {
                identity.AddClaim(new Claim("role", "admin"));
            }
            else
            {
                identity.AddClaim(new Claim("role", "user"));
            }


            var ctx = HttpContext.Current.GetOwinContext();
            var authManager = ctx.Authentication;
            authManager.SignIn(identity);
        }
    }
}