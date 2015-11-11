using System.Collections.Generic;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public interface IUserRepository
    {
        List<UserData> Get();
        UserData GetUserById(int staffNumber);
        void Create(UserData user);
        void Delete(int staffNumber);
        void Update(UserData user);
        HolidayBooking GetHolidayBookingById(int holidayId);
    }
}