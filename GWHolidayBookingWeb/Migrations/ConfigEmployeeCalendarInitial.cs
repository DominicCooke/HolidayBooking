using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using GWHolidayBookingWeb.DataAccess;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Migrations
{
    internal sealed class ConfigEmployeeCalendarInitial : DbMigrationsConfiguration<EmployeeContext>
    {
        public ConfigEmployeeCalendarInitial()
        {
            AutomaticMigrationsEnabled = true;
            MigrationsDirectory = @"Migrations\User";
        }

        protected override void Seed(EmployeeContext context)
        {
            var publicHolidays = new List<PublicHoliday>
            {
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