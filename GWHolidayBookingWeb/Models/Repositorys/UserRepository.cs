using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using MoreLinq;
using Ninject.Extensions.Conventions.BindingGenerators;

namespace GWHolidayBookingWeb.Models
{
    public class UserRepository : IUserRepository
    {
        private readonly IUserContext context;

        public UserRepository(IUserContext context)
        {
            this.context = context;
        }

        public List<User> Get()
        {
            var userList = context.Users.Include("HolidayBookings").ToList();
            return userList;
        }

        public User GetUserById(int staffNumber)
        {
            var user = context.Users.Include("HolidayBookings").FirstOrDefault(x => x.StaffNumber == staffNumber);
            return user;
        }

        public void Create(User user)
        {
            context.Users.Add(user);
        }

        public void Delete(int staffNumber)
        {
            throw new NotImplementedException();
        }

        public void Update(User user)
        {
            var userInDb = context.Users.Find(user.StaffNumber);

            context.Entry(userInDb).CurrentValues.SetValues(user);

            foreach (var holidayBooking in userInDb.HolidayBookings.ToList())
            {
                if (!user.HolidayBookings.Any(h => h.HolidayId == holidayBooking.HolidayId))
                {
                    context.Entry(userInDb.HolidayBookings.SingleOrDefault(h => h.HolidayId == holidayBooking.HolidayId))
                        .State = EntityState.Deleted;
                    userInDb.HolidayBookings.Remove(holidayBooking);

                }
            }

            foreach (var holidayBooking in user.HolidayBookings)
            {
                var holidayBookingInDb =
                    userInDb.HolidayBookings.SingleOrDefault(h => h.HolidayId == holidayBooking.HolidayId);
                if (holidayBookingInDb != null)
                {
                    context.Entry(holidayBookingInDb).CurrentValues.SetValues(holidayBooking);
                }
                else
                {
                    context.HolidayBookings.Attach(holidayBooking);
                    userInDb.HolidayBookings.Add(holidayBooking);
                    context.Entry(userInDb.HolidayBookings.SingleOrDefault(h => h.HolidayId == holidayBooking.HolidayId)).State = EntityState.Added;
                    context.SaveChanges();
                }
            }
            context.SaveChanges();
        }

        public HolidayBooking GetHolidayBookingById(int holidayId)
        {
            var HolidayBooking = context.HolidayBookings.FirstOrDefault(x => x.HolidayId == holidayId);
            return HolidayBooking;
        }
    }
}