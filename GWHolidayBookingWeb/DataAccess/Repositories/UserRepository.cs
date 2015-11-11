using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IUserContext context;

        public UserRepository(IUserContext context)
        {
            this.context = context;
        }

        public List<UserData> Get()
        {
            List<UserData> userList = context.Users.Include("HolidayBookings").ToList();
            return userList;
        }

        public UserData GetUserById(int staffNumber)
        {
            UserData user = context.Users.Include("HolidayBookings").FirstOrDefault(x => x.StaffNumber == staffNumber);
            return user;
        }

        public void Create(UserData user)
        {
            context.Users.Add(user);
        }

        public void Delete(int staffNumber)
        {
            throw new NotImplementedException();
        }

        public void Update(UserData user)
        {
            UserData userInDb = context.Users.Find(user.StaffNumber);

            context.Entry(userInDb).CurrentValues.SetValues(user);

            foreach (HolidayBooking holidayBooking in userInDb.HolidayBookings.ToList())
            {
                if (!user.HolidayBookings.Any(h => h.HolidayId == holidayBooking.HolidayId))
                {
                    context.Entry(userInDb.HolidayBookings.SingleOrDefault(h => h.HolidayId == holidayBooking.HolidayId))
                        .State = EntityState.Deleted;
                    userInDb.HolidayBookings.Remove(holidayBooking);
                }
            }

            foreach (HolidayBooking holidayBooking in user.HolidayBookings)
            {
                HolidayBooking holidayBookingInDb =
                    userInDb.HolidayBookings.SingleOrDefault(h => h.HolidayId == holidayBooking.HolidayId);
                if (holidayBookingInDb != null)
                {
                    context.Entry(holidayBookingInDb).CurrentValues.SetValues(holidayBooking);
                }
                else
                {
                    context.HolidayBookings.Attach(holidayBooking);
                    userInDb.HolidayBookings.Add(holidayBooking);
                    context.Entry(userInDb.HolidayBookings.SingleOrDefault(h => h.HolidayId == holidayBooking.HolidayId))
                        .State = EntityState.Added;
                    context.SaveChanges();
                }
            }
            context.SaveChanges();
        }

        public HolidayBooking GetHolidayBookingById(int holidayId)
        {
            HolidayBooking HolidayBooking = context.HolidayBookings.FirstOrDefault(x => x.HolidayId == holidayId);
            return HolidayBooking;
        }
    }
}