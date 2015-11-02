using System.Runtime.Remoting.Contexts;
using System.Web.Helpers;
using GWHolidayBookingWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection.Emit;
using System.Web.Http;

namespace GWHolidayBookingWeb.Controllers
{
    public class theApiController : ApiController
    {
        private readonly IUserContext context;
        private readonly IUserService userService;

        public theApiController(IUserService userService, IUserContext context)
        {
            this.userService = userService;
            this.context = context;
        }

        public List<User> GetUsers()
        {
            var listOfUsers = userService.Get();
            return listOfUsers;
        }
        public User GetUserById(int staffNumber)
        {
            var user = userService.GetUserById(staffNumber);

            return user;
        }
        public void PostUser(User user)
        {
            userService.Update(user);
            context.SaveChanges();
        }
        public void PostUsers(List<User> users)
        {
            foreach (var user in users)
            {
                userService.Update(user);
                context.SaveChanges();
            }
        }
    }
}






