﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using GWHolidayBookingWeb.Controllers.Filter;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;
using GWHolidayBookingWeb.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GWHolidayBookingWeb.Controllers
{
    [ClaimsAuthorize(RoleName = "Admin")]
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        private readonly IEmployeeDataService employeeDataService;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly UserManager<IdentityEmployee> userManager;

        public UserController(IEmployeeDataService employeeDataService)
        {
            this.employeeDataService = employeeDataService;
            roleManager = Startup.RoleManagerFactory();
            userManager = Startup.UserManagerFactory();
            roleManager.CreateAsync(new IdentityRole("Admin"));
            roleManager.CreateAsync(new IdentityRole("User"));
        }

        [Route("DeleteUserAndEmployee")]
        [HttpPost]
        public async Task<IHttpActionResult> DeleteUserAndEmployee(
            DeleteUserAndEmployeeViewModel deleteUserAndEmployeeViewModel)
        {
            employeeDataService.Delete(deleteUserAndEmployeeViewModel.StaffId);
            var user = await userManager.FindByIdAsync(deleteUserAndEmployeeViewModel.IdentityId);
            var result = await userManager.DeleteAsync(user);
            var errorResult = GetErrorResult(result);
            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok();
        }

        [Route("GetUsersAndRoles")]
        public async Task<GetUsersAndRolesViewModel> GetUsersAndRoles()
        {
            var listOfAllEmployees = employeeDataService.Get();
            var listOfAllIdentityRoles = await roleManager.Roles.ToListAsync();
            var listOfAllIdentityUsers = await userManager.Users.ToListAsync();
            var listOfAllIdentityRolesAndUsers = listOfAllIdentityUsers.Select(User => new
            {
                User,
                UserRoles = User.Roles.Select(Role => new
                {
                    Id = Role.RoleId,
                    name = listOfAllIdentityRoles.First(IdentityRoleModel => IdentityRoleModel.Id == Role.RoleId).Name
                })
            });

            var joined = from RoleAndUsers in listOfAllIdentityRolesAndUsers
                         join Employee in listOfAllEmployees on RoleAndUsers.User.StaffId equals Employee.StaffId
                         select new UpdateEmployeeViewModel
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
            var getUsersAndRolesViewModel = new GetUsersAndRolesViewModel
            {
                ListOfCalendarViewModels = joined.ToList(),
                ListOfIdentityRoles = listOfAllIdentityRoles
            };
            return getUsersAndRolesViewModel;
        }

        [AllowAnonymous]
        [Route("RegisterUserAndEmployee")]
        public async Task<IHttpActionResult> RegisterUserAndEmployee(
            RegisterUserAndEmployeeViewModel userAndEmployeeViewModel)
        {
            userAndEmployeeViewModel.StaffId = Guid.NewGuid();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new IdentityEmployee
            {
                StaffId = userAndEmployeeViewModel.StaffId,
                UserName = userAndEmployeeViewModel.EmailAddress
            };

            var result = await userManager.CreateAsync(user, "123123");
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            var employee = new Employee
            {
                FirstName = userAndEmployeeViewModel.FirstName,
                LastName = userAndEmployeeViewModel.LastName,
                HolidayAllowance = 25,
                RemainingAllowance = 25,
                HolidayBookings = new List<EmployeeHolidayBooking>(),
                StaffId = userAndEmployeeViewModel.StaffId
            };
            employeeDataService.Create(employee);

            return Ok();
        }

        [Route("UserSetRole")]
        public async Task<IHttpActionResult> UserSetRole(UserSetRoleViewModel userSetRoleViewModel)
        {
            IdentityResult result;
            IdentityUser user = await userManager.FindByIdAsync(userSetRoleViewModel.IdentityId);
            var exists = await userManager.IsInRoleAsync(user.Id, userSetRoleViewModel.RoleName);
            if (exists)
            {
                result = await userManager.RemoveFromRoleAsync(user.Id, userSetRoleViewModel.RoleName);
            }
            else
            {
                result = await userManager.AddToRoleAsync(user.Id, userSetRoleViewModel.RoleName);
            }
            var errorResult = GetErrorResult(result);

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
                    foreach (var error in result.Errors)
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