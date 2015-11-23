using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using GWHol.Web.ViewModels;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.DataAccess.Identity.ViewModels;
using GWHolidayBookingWeb.Models;
using GWHolidayBookingWeb.Services.Employee;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using AutoMapper;

namespace GWHolidayBookingWeb.Controllers
{
    [RoutePrefix("api/Employee")]
    public class EmployeeController : ApiController
    {
        private readonly IEmployeeDataService employeeDataService;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly UserManager<IdentityEmployee> userManager;

        public EmployeeController(IEmployeeDataService employeeDataService)
        {
            this.employeeDataService = employeeDataService;
            roleManager = Startup.RoleManagerFactory();
            userManager = Startup.UserManagerFactory();
            roleManager.CreateAsync(new IdentityRole("Admin"));
            roleManager.CreateAsync(new IdentityRole("User"));
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

            var user = new IdentityEmployee
            {
                StaffId = employeeCreateViewModel.StaffId,
                UserName = employeeCreateViewModel.EmailAddress
            };

            IdentityResult result = await userManager.CreateAsync(user, "123123");
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

        [Route("SetRole")]
        public async Task<IHttpActionResult> SetRole(IdentityEmployeeRoleAddViewModel identityEmployeeRoleAddViewModel)
        {
            IdentityResult result;
            IdentityUser user = await userManager.FindByIdAsync(identityEmployeeRoleAddViewModel.IdentityId);
            var exists = await userManager.IsInRoleAsync(user.Id, identityEmployeeRoleAddViewModel.RoleName);
            if (exists == true)
            {
                result = await userManager.RemoveFromRoleAsync(user.Id, identityEmployeeRoleAddViewModel.RoleName);
            }
            else
            {
                result = await userManager.AddToRoleAsync(user.Id, identityEmployeeRoleAddViewModel.RoleName);
            }
            IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }
            return Ok();
        }

        [Route("GetIdentityEmployees")]
        public async Task<List<EmployeeCalendarViewModel>> GetIdentityEmployees()
        {
            List<EmployeeCalendar> listOfAllEmployees = employeeDataService.Get();
            List<IdentityRole> listOfAllIdentityRoles = await roleManager.Roles.ToListAsync();
            List<IdentityEmployee> listOfAllIdentityUsers = await userManager.Users.ToListAsync();
            var listOfAllIdentityRolesAndUsers = listOfAllIdentityUsers.Select(User => new
            {
                User,
                UserRoles = User.Roles.Select(Role => new
                {
                    Id = Role.RoleId,
                    name = listOfAllIdentityRoles.First(IdentityRoleModel => IdentityRoleModel.Id == Role.RoleId).Name
                })
            });

            IEnumerable<EmployeeCalendarViewModel> joined = from RoleAndUsers in listOfAllIdentityRolesAndUsers
                                                            join Employee in listOfAllEmployees on RoleAndUsers.User.StaffId equals Employee.StaffId
                                                            select new EmployeeCalendarViewModel
                                                            {
                                                                HolidayAllowance = Employee.HolidayAllowance,
                                                                RemainingAllowance = Employee.RemainingAllowance,
                                                                StaffId = Employee.StaffId,
                                                                FirstName = Employee.FirstName,
                                                                LastName = Employee.LastName,
                                                                UserViewModel = new IdentityUserViewModel
                                                                {
                                                                    IdentityId = RoleAndUsers.User.Id,
                                                                    Username = RoleAndUsers.User.UserName,
                                                                    RoleViewModels = RoleAndUsers.UserRoles.Select(Role => new IdentityRole
                                                                    {
                                                                        Id = Role.Id,
                                                                        Name = Role.name
                                                                    }).ToList()
                                                                }
                                                            };
            return joined.ToList();
        }

        [Route("GetIdentityRoles")]
        public async Task<List<IdentityRole>> GetIdentityRoles()
        {
            List<IdentityRole> result = await roleManager.Roles.ToListAsync();
            return result;
        }

        [Route("Update")]
        public void Update(EmployeeCalendarViewModel employeeCalendarViewModel)
        {
            employeeDataService.UpdateEmployee(employeeCalendarViewModel);
        }

        [Route("Delete")]
        [HttpPost]
        public async Task<IHttpActionResult> Delete(EmployeeDeleteViewModel employeeDeleteViewModel)
        {
            employeeDataService.Delete(employeeDeleteViewModel.StaffId);
            var user = await userManager.FindByIdAsync(employeeDeleteViewModel.IdentityId.ToString());
            IdentityResult result = await userManager.DeleteAsync(user);
            IHttpActionResult errorResult = GetErrorResult(result);
            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok();
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