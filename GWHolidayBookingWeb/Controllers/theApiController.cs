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

        public List<User> GetUsers()
        {
            return Models.User.GetAll();
        }
        public User GetUserById(int StaffNumber)
        {
            return Models.User.GetById(StaffNumber);
        }
        public void PostUsers(User User)
        {
            Models.User.SaveAll(User);
            Models.HolidayBooking.SaveAll(User.HolidayBookings);
        }
    }
}






