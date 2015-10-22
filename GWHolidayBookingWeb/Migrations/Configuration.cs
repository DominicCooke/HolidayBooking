namespace GWHolidayBookingWeb.Migrations
{
    using GWHolidayBookingWeb.Models;
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
                        RemainingAllowance = 20,
                        isVisible = false,
                        HolidayBookings = new List<HolidayBooking>
                        {
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 5),
                                EndDate = new DateTime(2015, 10, 9),
                                AllowanceDays = 4,
                                BookingStatus = BookingStatusEnum.Pending
                            }
                        }
                    },
                    new User
                    {
                        FirstName = "Mary",
                        LastName = "B",
                        HolidayAllowance = 25,
                        RemainingAllowance = 17,
                        isVisible = false,
                        HolidayBookings = new List<HolidayBooking>
                        {
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 14),
                                EndDate = new DateTime(2015, 10, 16),
                                AllowanceDays = 3,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 19),
                                EndDate = new DateTime(2015, 10, 23),
                                AllowanceDays = 5,
                                BookingStatus = BookingStatusEnum.Confirmed
                            }
                        }
                    },
                    new User
                    {
                        FirstName = "Randy",
                        LastName = "C",
                        HolidayAllowance = 25,
                        RemainingAllowance = 17,
                        isVisible = false,
                        HolidayBookings = new List<HolidayBooking>
                        {
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 12),
                                EndDate = new DateTime(2015, 10, 16),
                                AllowanceDays = 5,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 27),
                                EndDate = new DateTime(2015, 10, 29),
                                AllowanceDays = 3,
                                BookingStatus = BookingStatusEnum.Pending
                            }
                        }
                    },
                    new User
                    {
                        FirstName = "Roger",
                        LastName = "D",
                        HolidayAllowance = 25,
                        RemainingAllowance = 18,
                        isVisible = false,
                        HolidayBookings = new List<HolidayBooking>
                        {
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 29),
                                EndDate = new DateTime(2015, 10, 30),
                                AllowanceDays = 2,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 9, 28),
                                EndDate = new DateTime(2015, 10, 2),
                                AllowanceDays = 5,
                                BookingStatus = BookingStatusEnum.Confirmed
                            }
                        }
                    },
                    new User
                    {
                        FirstName = "Ronald",
                        LastName = "E",
                        HolidayAllowance = 25,
                        RemainingAllowance = 17,
                        isVisible = false,
                        HolidayBookings = new List<HolidayBooking>
                        {
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 7),
                                EndDate = new DateTime(2015, 10, 9),
                                AllowanceDays = 3,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 19),
                                EndDate = new DateTime(2015, 10, 23),
                                AllowanceDays = 5,
                                BookingStatus = BookingStatusEnum.Confirmed
                            }
                        }
                    }
            };

            users.ForEach(u => context.Users.Add(u));
            context.SaveChanges();
        }
    }
}
