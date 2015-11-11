using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models.Services
{
    public interface IUserService
    {
        List<User> Get();
        User GetUserById(int staffNumber);
        void Delete(int staffNumber);
        void Update(User user);
        HolidayBooking GetHolidayBookingById(int holidayId);
    }
}