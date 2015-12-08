using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using GWHolidayBookingWeb.DataAccess;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Migrations
{
    internal sealed class ConfigEmployeeCalendar : DbMigrationsConfiguration<EmployeeContext>
    {
        public ConfigEmployeeCalendar()
        {
            AutomaticMigrationsEnabled = true;
            MigrationsDirectory = @"Migrations\User";
        }

        protected override void Seed(EmployeeContext context)
        {
            //var users = new List<Employee>();
            //    new EmployeeCalendar
            //    {
            //        StaffId = Guid.NewGuid(),
            //        FirstName = "John",
            //        LastName = "A",
            //        HolidayAllowance = 25,
            //        RemainingAllowance = 25,
            //        HolidayBookings = new List<EmployeeCalendarHoldiayBooking>()
            //    },
            //    new EmployeeCalendar
            //    {
            //        StaffId = Guid.NewGuid(),
            //        FirstName = "Mary",
            //        LastName = "B",
            //        HolidayAllowance = 25,
            //        RemainingAllowance = 25,
            //        HolidayBookings = new List<EmployeeCalendarHoldiayBooking>()
            //    },
            //    new EmployeeCalendar
            //    {
            //        StaffId = Guid.NewGuid(),
            //        FirstName = "Randy",
            //        LastName = "C",
            //        HolidayAllowance = 25,
            //        RemainingAllowance = 25,
            //        HolidayBookings = new List<EmployeeCalendarHoldiayBooking>()
            //    },
            //    new EmployeeCalendar
            //    {
            //        StaffId = Guid.NewGuid(),
            //        FirstName = "Roger",
            //        LastName = "D",
            //        HolidayAllowance = 25,
            //        RemainingAllowance = 25,
            //        HolidayBookings = new List<EmployeeCalendarHoldiayBooking>()
            //    },
            //    new EmployeeCalendar
            //    {
            //        StaffId = Guid.NewGuid(),
            //        FirstName = "Ronald",
            //        LastName = "E",
            //        HolidayAllowance = 25,
            //        RemainingAllowance = 25,
            //        HolidayBookings = new List<EmployeeCalendarHoldiayBooking>()
            //    },
            //    new EmployeeCalendar
            //    {
            //        StaffId = Guid.NewGuid(),
            //        FirstName = "Dominic",
            //        LastName = "F",
            //        HolidayAllowance = 25,
            //        RemainingAllowance = 25,
            //        HolidayBookings = new List<EmployeeCalendarHoldiayBooking>()
            //    },
            //    new EmployeeCalendar
            //    {
            //        StaffId = Guid.NewGuid(),
            //        FirstName = "Alonso",
            //        LastName = "G",
            //        HolidayAllowance = 25,
            //        RemainingAllowance = 25,
            //        HolidayBookings = new List<EmployeeCalendarHoldiayBooking>()
            //    }
            //};
            //users.ForEach(u => context.Employees.Add(u));

            var publicHolidays = new List<PublicHoliday>
            {
                new PublicHoliday
                {
                    PublicHolidayId = Guid.NewGuid(),
                    Date = new DateTime(2015, 12, 25)
                },
                new PublicHoliday
                {
                    PublicHolidayId = Guid.NewGuid(),
                    Date = new DateTime(2015, 12, 26)
                },
                new PublicHoliday
                {
                    PublicHolidayId = Guid.NewGuid(),
                    Date = new DateTime(2015, 12, 28)
                },
                new PublicHoliday
                {
                    PublicHolidayId = Guid.NewGuid(),
                    Date = new DateTime(2016, 1, 1)
                },
                new PublicHoliday
                {
                    PublicHolidayId = Guid.NewGuid(),
                    Date = new DateTime(2016, 3, 25)
                },
                new PublicHoliday
                {
                    PublicHolidayId = Guid.NewGuid(),
                    Date = new DateTime(2016, 3, 28)
                },
                new PublicHoliday
                {
                    PublicHolidayId = Guid.NewGuid(),
                    Date = new DateTime(2016, 5, 30)
                },
                new PublicHoliday
                {
                    PublicHolidayId = Guid.NewGuid(),
                    Date = new DateTime(2016, 8, 29)
                }
                ,
                new PublicHoliday
                {
                    PublicHolidayId = Guid.NewGuid(),
                    Date = new DateTime(2016, 12, 25)
                }
                ,
                new PublicHoliday
                {
                    PublicHolidayId = Guid.NewGuid(),
                    Date = new DateTime(2016, 12, 26)
                }
                ,
                new PublicHoliday
                {
                    PublicHolidayId = Guid.NewGuid(),
                    Date = new DateTime(2016, 12, 27)
                }
            };
            publicHolidays.ForEach(p => context.PublicHolidays.Add(p));
            context.SaveChanges();
        }
    }
}