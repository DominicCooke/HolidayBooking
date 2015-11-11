using System.Collections.Generic;
using GWHolidayBookingWeb.DataAccess.Repositories;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Services.User
{
    public class UserDataService : IUserDataService
    {
        private readonly IUserRepository userRepository;

        public UserDataService(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        public List<UserData> Get()
        {
            return userRepository.Get();
        }

        public UserData GetUserById(int staffNumber)
        {
            return userRepository.GetUserById(staffNumber);
        }

        public HolidayBooking GetHolidayBookingById(int holidayId)
        {
            return userRepository.GetHolidayBookingById(holidayId);
        }

        public void Delete(int staffNumber)
        {
            userRepository.Delete(staffNumber);
        }

        public void Update(UserData user)
        {
            if (user.StaffNumber == 0)
            {
                userRepository.Create(user);
            }
            else
            {
                userRepository.Update(user);
            }
        }
    }
}