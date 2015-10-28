using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public interface IUserService
    {
        List<User> Get();
        User GetUserById(int staffNumber);
        HolidayBooking GetHolidayBookingById(int holidayId);
        void Delete(int staffNumber);
        void Update(User user);
    }
}