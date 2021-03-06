﻿using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security.OAuth;

namespace HolidayBookingWeb.DataAccess.Identity.Providers
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
            var identity = new ClaimsIdentity(DefaultAuthenticationTypes.ApplicationCookie);
            var userManager = Startup.UserManagerFactory();
            var user = await userManager.FindAsync(context.UserName, context.Password);
            if (user == null)
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }
            identity.AddClaim(new Claim("id", user.StaffId.ToString()));
            identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
            var listOfRoles = await userManager.GetRolesAsync(user.Id);
            if (listOfRoles.Contains("admin"))
            {
                identity.AddClaim(new Claim("role", "admin"));
            }
            else
            {
                identity.AddClaim(new Claim("role", "user"));
            }
            context.Validated(identity);


            var ctx = HttpContext.Current.GetOwinContext();
            var authManager = ctx.Authentication;
            authManager.SignIn(identity);
        }
    }
}