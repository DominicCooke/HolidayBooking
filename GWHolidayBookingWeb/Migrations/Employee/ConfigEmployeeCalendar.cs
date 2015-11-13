using System.Collections.Generic;
using System.Data.Entity.Migrations;
using GWHolidayBookingWeb.DataAccess;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Migrations.Employee
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
            var users = new List<EmployeeCalendar>();
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

            users.ForEach(u => context.Employees.Add(u));
            context.SaveChanges();
        }
    }
}