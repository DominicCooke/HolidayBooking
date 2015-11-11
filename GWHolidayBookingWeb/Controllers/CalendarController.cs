using System.Collections.Generic;
using System.Web.Http;
using GWHolidayBookingWeb.DataAccess;
using GWHolidayBookingWeb.Models;
using GWHolidayBookingWeb.Services.User;

namespace GWHolidayBookingWeb.Controllers
{
    [RoutePrefix("api/Calendar")]
    //[Authorize]
    public class CalendarController : ApiController
    {
        private readonly IUserContext context;
        private readonly IUserDataService userService;

        public CalendarController(IUserDataService userService, IUserContext context)
        {
            this.userService = userService;
            this.context = context;
        }

        public List<UserData> GetUsers()
        {
            var listOfUsers = userService.Get();
            return listOfUsers;
        }
        public UserData GetUserById(int staffNumber)
        {
            var user = userService.GetUserById(staffNumber);
            return user;
        }
        public void PostUser(UserData user)
        {
            userService.Update(user);
            context.SaveChanges();
        }
        public void PostUsers(List<UserData> users)
        {
            foreach (var user in users)
            {
                userService.Update(user);
                context.SaveChanges();
            }
        }
    }
}






