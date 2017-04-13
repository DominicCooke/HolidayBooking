using System.Security.Claims;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace HolidayBookingWeb.Controllers.Filter
{
    public class ClaimsAuthorize : AuthorizeAttribute
    {
        public string RoleName { get; set; }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var owinContext = HttpContext.Current.Request.GetOwinContext();
            var user = (ClaimsIdentity) owinContext.Authentication.User.Identity;

            var subIdClaims = user.FindFirst("role");
            if (subIdClaims == null)
            {
                return false;
            }

            var userSubId = subIdClaims.Value;

            if (!RoleName.Contains(userSubId))
            {
                return false;
            }

            return base.IsAuthorized(actionContext);
        }
    }
}