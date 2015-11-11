namespace GWHolidayBookingWeb.Migrations
{
    using GWHolidayBookingWeb.Models;
    using GWHolidayBookingWeb.Models.Contexts;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<UserContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }
        protected override void Seed(UserContext context)
        {
            var users = new List<User>
            {
            new User
                    {
                        FirstName = "John",
                        LastName = "A",
                        HolidayAllowance = 25,
                        RemainingAllowance = 25,
                        HolidayBookings = new List<HolidayBooking>
                        {
                        }
                    },
           new User
                    {
                        FirstName = "Mary",
                        LastName = "B",
                        HolidayAllowance = 25,
                        RemainingAllowance = 25,
                        HolidayBookings = new List<HolidayBooking>
                        {
                        }
                    },
                    new User
                    {
                        FirstName = "Randy",
                        LastName = "C",
                        HolidayAllowance = 25,
                        RemainingAllowance = 25,
                        HolidayBookings = new List<HolidayBooking>
                        {
                        }
                    },
                    new User
                    {
                        FirstName = "Roger",
                        LastName = "D",
                        HolidayAllowance = 25,
                        RemainingAllowance = 25,
                        HolidayBookings = new List<HolidayBooking>
                        {
                        }
                    },
                    new User
                    {
                        FirstName = "Ronald",
                        LastName = "E",
                        HolidayAllowance = 25,
                        RemainingAllowance = 25,
                        HolidayBookings = new List<HolidayBooking>
                        {
                        }
                    },
                    new User
                    {
                        FirstName = "Dominic",
                        LastName = "F",
                        HolidayAllowance = 25,
                        RemainingAllowance = 25,
                        HolidayBookings = new List<HolidayBooking>
                        {
                        }
                    },
                    new User
                    {
                        FirstName = "Alonso",
                        LastName = "G",
                        HolidayAllowance = 25,
                        RemainingAllowance = 25,
                        HolidayBookings = new List<HolidayBooking>
                        {
                        }
                    }
            };

            users.ForEach(u => context.Users.Add(u));
            context.SaveChanges();
        }
    }
}
