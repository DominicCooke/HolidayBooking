using System.Threading.Tasks;
using System.Web.Http;
using GWHolidayBookingWeb.DataAccess.Identity;
using Microsoft.AspNet.Identity;
using GWHolidayBookingWeb.Services.Identity;

namespace GWHolidayBookingWeb.Controllers
{
    [RoutePrefix("api/Account")]
    public class EmployeeController : ApiController
    {
        private readonly IIdentityService identityService;

        public EmployeeController(IIdentityService identityService)
        {
            this.identityService = identityService;
        }

        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(IdentityEmployee identityEmployee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await identityService.RegisterEmployee(identityEmployee);
            IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }
            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                identityService.Dispose();
            }
            base.Dispose(disposing);
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    return BadRequest();
                }
                return BadRequest(ModelState);
            }
            return null;
        }
    }
}