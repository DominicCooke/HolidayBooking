using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using GWHolidayBookingWeb.DataAccess.Identity;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security.OAuth;

namespace GWHolidayBookingWeb.DataAccess.Providers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] {"*"});
            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            UserManager<IdentityEmployee> userManager = Startup.UserManagerFactory();
            IdentityEmployee user = await userManager.FindAsync(context.UserName, context.Password);
            if (user == null)
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }
            identity.AddClaim(new Claim("id", user.StaffId.ToString()));
            identity.AddClaim(new Claim(ClaimTypes.Name, "d.c@gradweb.co.uk"));
            IList<string> listOfRoles = await userManager.GetRolesAsync(user.Id);
            if (listOfRoles.Contains("Admin"))
            {
                identity.AddClaim(new Claim("role", "Admin"));
            }
            else
            {
                identity.AddClaim(new Claim("role", "User"));
            }
            context.Validated(identity);
        }
    }
}