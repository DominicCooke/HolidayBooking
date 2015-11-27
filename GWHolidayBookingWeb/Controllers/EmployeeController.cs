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
using GWHolidayBookingWeb.Services;
using Microsoft.Owin;

namespace GWHolidayBookingWeb.Controllers
{
    [Authorize]
    [RoutePrefix("api/Employee")]
    public class EmployeeController : ApiController
    {
        private readonly IEmployeeDataService employeeDataService;

        public EmployeeController(IEmployeeDataService employeeDataService)
        {
            this.employeeDataService = employeeDataService;
        }
        [Route("GetEmployees")]
        public List<Employee> GetEmployees()
        {
            return employeeDataService.Get();
        }

        [Route("GetEmployeeById")]
        public GetEmployeeByIdViewModel GetEmployeeById()
        {
            IOwinContext owinContext = ControllerContext.Request.GetOwinContext();
            var user = (ClaimsIdentity)owinContext.Authentication.User.Identity;
            Claim staffIdClaim = user.Claims.FirstOrDefault(c => c.Type == "id");
            Claim roleClaim = user.Claims.FirstOrDefault(c => c.Type == "role");
            var userWithRole = Mapper.Map<GetEmployeeByIdViewModel>(employeeDataService.GetEmployeeById(Guid.Parse(staffIdClaim.Value)));
            userWithRole.RoleName = roleClaim.Value;
            return userWithRole;
        }

        [Route("UpdateEmployeeAndHoliday")]
        public void UpdateEmployeeAndHoliday(Employee employeeAndHoliday)
        {
            employeeDataService.UpdateHolidays(employeeAndHoliday);
        }

        [ClaimsAuthorize(RoleName = "Admin")]
        [Route("UpdateEmployeesAndHolidays")]
        public void UpdateEmployeesAndHolidays(List<Employee> employeesAndHolidays)
        {
            foreach (Employee employeeAndHoliday in employeesAndHolidays)
            {
                employeeDataService.UpdateHolidays(employeeAndHoliday);
            }
        }

        [Route("UpdateEmployee")]
        public void UpdateEmployee(UpdateEmployeeViewModel updateEmployeeViewModel)
        {
            employeeDataService.UpdateEmployee(updateEmployeeViewModel);
        }
    }
}