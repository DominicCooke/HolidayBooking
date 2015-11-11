using System.Collections.Generic;
using System.Data.Entity.Migrations;
using GWHolidayBookingWeb.DataAccess;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<UserContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(UserContext context)
        {
            var users = new List<UserData>
            {
                new UserData
                {
                    FirstName = "John",
                    LastName = "A",
                    HolidayAllowance = 25,
                    RemainingAllowance = 25,
                    HolidayBookings = new List<HolidayBooking>()
                },
                new UserData
                {
                    FirstName = "Mary",
                    LastName = "B",
                    HolidayAllowance = 25,
                    RemainingAllowance = 25,
                    HolidayBookings = new List<HolidayBooking>()
                },
                new UserData
                {
                    FirstName = "Randy",
                    LastName = "C",
                    HolidayAllowance = 25,
                    RemainingAllowance = 25,
                    HolidayBookings = new List<HolidayBooking>()
                },
                new UserData
                {
                    FirstName = "Roger",
                    LastName = "D",
                    HolidayAllowance = 25,
                    RemainingAllowance = 25,
                    HolidayBookings = new List<HolidayBooking>()
                },
                new UserData
                {
                    FirstName = "Ronald",
                    LastName = "E",
                    HolidayAllowance = 25,
                    RemainingAllowance = 25,
                    HolidayBookings = new List<HolidayBooking>()
                },
                new UserData
                {
                    FirstName = "Dominic",
                    LastName = "F",
                    HolidayAllowance = 25,
                    RemainingAllowance = 25,
                    HolidayBookings = new List<HolidayBooking>()
                },
                new UserData
                {
                    FirstName = "Alonso",
                    LastName = "G",
                    HolidayAllowance = 25,
                    RemainingAllowance = 25,
                    HolidayBookings = new List<HolidayBooking>()
                }
            };

            users.ForEach(u => context.Users.Add(u));
            context.SaveChanges();
        }
    }
}