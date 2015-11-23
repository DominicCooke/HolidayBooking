using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using GWHolidayBookingWeb.DataAccess;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.Models;
using GWHolidayBookingWeb.Services.Employee;
using Microsoft.Owin;

namespace GWHolidayBookingWeb.Controllers
{
    [RoutePrefix("api/Calendar")]
    [Authorize]
    public class CalendarController : ApiController
    {
        private readonly IEmployeeContext context;
        private readonly IEmployeeDataService employeeDataService;

        public CalendarController(IEmployeeDataService employeeDataService, IEmployeeContext context)
        {
            this.employeeDataService = employeeDataService;
            this.context = context;
        }

        public List<EmployeeCalendar> GetEmployees()
        {
            return employeeDataService.Get();
        }

        public EmployeeCalendar GetEmployeeById()
        {
            IOwinContext owinContext = ControllerContext.Request.GetOwinContext();
            var user = (ClaimsIdentity) owinContext.Authentication.User.Identity;
            Claim staffIdClaim = user.Claims.FirstOrDefault(c => c.Type == "id");
            return employeeDataService.GetEmployeeById(Guid.Parse(staffIdClaim.Value));
        }

        public void UpdateHoliday(EmployeeCalendar employee)
        {
            employeeDataService.UpdateHolidays(employee);
        }

        public void UpdateHolidays(List<EmployeeCalendar> employees)
        {
            foreach (EmployeeCalendar employee in employees)
            {
                employeeDataService.UpdateHolidays(employee);
            }
        }
    }
}