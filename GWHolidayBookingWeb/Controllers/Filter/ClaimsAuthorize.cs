using System.Security.Claims;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using Microsoft.Owin;

namespace GWHolidayBookingWeb.Controllers.Filter
{
    public class ClaimsAuthorize : AuthorizeAttribute
    {
        public string RoleName { get; set; }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            IOwinContext owinContext = HttpContext.Current.Request.GetOwinContext();
            var user = (ClaimsIdentity) owinContext.Authentication.User.Identity;
            if (!(user is ClaimsIdentity))
            {
                return false;
            }

            Claim subIdClaims = user.FindFirst("role");
            if (subIdClaims == null)
            {
                return false;
            }

            string userSubId = subIdClaims.Value;

            if (!RoleName.Contains(userSubId))
            {
                return false;
            }

            return base.IsAuthorized(actionContext);
        }
    }
}