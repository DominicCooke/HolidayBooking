using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.Models;
using GWHolidayBookingWeb.Services.Employee;
using GWHolidayBookingWeb.Services.Identity;
using Microsoft.AspNet.Identity;

namespace GWHolidayBookingWeb.Controllers
{
    [RoutePrefix("api/Employee")]
    public class EmployeeController : ApiController
    {
        private readonly IEmployeeDataService employeeDataService;
        private readonly IIdentityService identityService;

        public EmployeeController(IIdentityService identityService, IEmployeeDataService employeeDataService)
        {
            this.identityService = identityService;
            this.employeeDataService = employeeDataService;
        }

        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(EmployeeCreateViewModel employeeCreateViewModel)
        {
            employeeCreateViewModel.StaffId = Guid.NewGuid();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await identityService.RegisterEmployee(employeeCreateViewModel);
            IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            var employee = new EmployeeCalendar
            {
                FirstName = employeeCreateViewModel.FirstName,
                LastName = employeeCreateViewModel.LastName,
                HolidayAllowance = 25,
                RemainingAllowance = 25,
                HolidayBookings = new List<EmployeeCalendarHoldiayBooking>(),
                StaffId = employeeCreateViewModel.StaffId
            };
            employeeDataService.Create(employee);

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