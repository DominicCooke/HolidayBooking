using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using AutoMapper;
using GWHolidayBookingWeb.Controllers.Filter;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;
using GWHolidayBookingWeb.Services.Employee;
using Microsoft.Owin;

namespace GWHolidayBookingWeb.Controllers
{
    [Authorize]
    [RoutePrefix("api/Calendar")]
    public class CalendarController : ApiController
    {
        private readonly IEmployeeDataService employeeDataService;

        public CalendarController(IEmployeeDataService employeeDataService)
        {
            this.employeeDataService = employeeDataService;
        }

        public List<EmployeeCalendar> GetEmployees()
        {
            return employeeDataService.Get();
        }

        public UserStartupViewModel GetEmployeeById()
        {
            IOwinContext owinContext = ControllerContext.Request.GetOwinContext();
            var user = (ClaimsIdentity) owinContext.Authentication.User.Identity;
            Claim staffIdClaim = user.Claims.FirstOrDefault(c => c.Type == "id");
            Claim roleClaim = user.Claims.FirstOrDefault(c => c.Type == "role");
            var userWithRole =
                Mapper.Map<UserStartupViewModel>(employeeDataService.GetEmployeeById(Guid.Parse(staffIdClaim.Value)));
            userWithRole.RoleName = roleClaim.Value;
            return userWithRole;
        }

        public void UpdateHoliday(EmployeeCalendar employee)
        {
            employeeDataService.UpdateHolidays(employee);
        }

        [ClaimsAuthorize(RoleName = "Admin")]
        public void UpdateHolidays(List<EmployeeCalendar> employees)
        {
            foreach (EmployeeCalendar employee in employees)
            {
                employeeDataService.UpdateHolidays(employee);
            }
        }
    }
}