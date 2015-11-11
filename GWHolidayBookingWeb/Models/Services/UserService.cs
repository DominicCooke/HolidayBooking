using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Ninject;
using Ninject.Activation;
using GWHolidayBookingWeb.Models.Repositorys;

namespace GWHolidayBookingWeb.Models.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;

        public UserService(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }
        public List<User> Get()
        {
           return userRepository.Get();
        }

        public User GetUserById(int staffNumber)
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

        public void Update(User user)
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