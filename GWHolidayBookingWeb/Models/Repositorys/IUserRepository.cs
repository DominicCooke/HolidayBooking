using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models.Repositorys
{
    public interface IUserRepository
    {
        List<User> Get();
        User GetUserById(int staffNumber);
        void Create(User user);
        void Delete(int staffNumber);
        void Update(User user);
        HolidayBooking GetHolidayBookingById(int holidayId);
    }
}