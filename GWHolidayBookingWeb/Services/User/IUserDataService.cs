using System.Collections.Generic;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Services.User
{
    public interface IUserDataService
    {
        List<UserData> Get();
        UserData GetUserById(int staffNumber);
        void Delete(int staffNumber);
        void Update(UserData user);
        HolidayBooking GetHolidayBookingById(int holidayId);
    }
}