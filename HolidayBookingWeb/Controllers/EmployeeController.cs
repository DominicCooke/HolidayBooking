using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using AutoMapper;
using HolidayBookingWeb.Controllers.Filter;
using HolidayBookingWeb.DataAccess.ViewModels;
using HolidayBookingWeb.Models;
using HolidayBookingWeb.Services;

namespace HolidayBookingWeb.Controllers
{
    [Authorize]
    [RoutePrefix("api/Employee")]
    public class EmployeeController : ApiController
    {
        private readonly IEmployeeDataService employeeDataService;
        private readonly ITeamDataService teamDataService;

        public EmployeeController(IEmployeeDataService employeeDataService, ITeamDataService teamDataService)
        {
            this.employeeDataService = employeeDataService;
            this.teamDataService = teamDataService;
        }

        [Route("GetEmployeeById")]
        public GetEmployeeByIdViewModel GetEmployeeById()
        {
            var owinContext = ControllerContext.Request.GetOwinContext();
            var user = (ClaimsIdentity) owinContext.Authentication.User.Identity;
            var staffIdClaim = user.Claims.FirstOrDefault(c => c.Type == "id");
            var roleClaim = user.Claims.FirstOrDefault(c => c.Type == "role");
            var userWithRole =
                Mapper.Map<GetEmployeeByIdViewModel>(employeeDataService.GetEmployeeById(Guid.Parse(staffIdClaim.Value)));
            userWithRole.RoleName = roleClaim.Value;
            userWithRole.TeamName = teamDataService.GetTeamById(userWithRole.TeamId).TeamName;
            return userWithRole;
        }

        [Route("GetEmployeesTeam")]
        public List<Employee> GetEmployeesTeam(Guid teamId)
        {
            return employeeDataService.GetTeam(teamId);
        }

        [Route("GetEmployees")]
        public List<Employee> GetEmployees()
        {
            return employeeDataService.Get();
        }

        [Route("GetPublicHolidays")]
        public List<PublicHoliday> GetPublicHolidays()
        {
            return employeeDataService.GetPublicHolidays();
        }

        [Route("EmployeeSetTeam")]
        public IHttpActionResult EmployeeSetTeam(EmployeeSetTeamViewModel employeeSetTeamViewModel)
        {
            employeeDataService.SetTeam(employeeSetTeamViewModel);
            return Ok();
        }

        [Route("UpdateEmployee")]
        public void UpdateEmployee(UpdateEmployeeViewModel updateEmployeeViewModel)
        {
            employeeDataService.UpdateEmployee(updateEmployeeViewModel);
        }

        [Route("UpdateEmployeeAndHoliday")]
        public void UpdateEmployeeAndHoliday(Employee employeeAndHoliday)
        {
            employeeDataService.UpdateHolidays(employeeAndHoliday);
        }

        [ClaimsAuthorize(RoleName = "admin")]
        [Route("UpdateEmployeesAndHolidays")]
        public void UpdateEmployeesAndHolidays(List<Employee> employeesAndHolidays)
        {
            foreach (var employeeAndHoliday in employeesAndHolidays)
            {
                employeeDataService.UpdateHolidays(employeeAndHoliday);
            }
        }
    }
}