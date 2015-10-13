using GWHolidayBookingWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection.Emit;
using System.Web.Http;

namespace GWHolidayBookingWeb.Controllers
{
    public class theApiController : ApiController
    {

        public List<User> GetUsers()
        {
            var TestData = Users.TestUsers;
            return TestData;
        }
        public void PostUsers(User data)
        {

        }
    }

    public static class Users
    {
        public static List<User> TestUsers
        {
            get
            {
                return new List<User>
                {
                    new User
                    {
                        StaffNumber = 0,
                        Name = "John",
                        HolidayAllowance = 25,
                        RemainingAllowance = 23,
                        isVisible = false,
                        HolidayBookings = new List<HolidayBooking>
                        {
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 5),
                                EndDate = new DateTime(2015, 10, 5),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Pending
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 14),
                                EndDate = new DateTime(2015, 10, 14),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Pending
                            }
                        }
                    },
                    new User
                    {
                        StaffNumber = 1,
                        Name = "Mary",
                        HolidayAllowance = 25,
                        RemainingAllowance = 17,
                        isVisible = false,
                        HolidayBookings = new List<HolidayBooking>
                        {
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 14),
                                EndDate = new DateTime(2015, 10, 14),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 15),
                                EndDate = new DateTime(2015, 10, 15),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 16),
                                EndDate = new DateTime(2015, 10, 16),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 19),
                                EndDate = new DateTime(2015, 10, 19),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 20),
                                EndDate = new DateTime(2015, 10, 20),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 21),
                                EndDate = new DateTime(2015, 10, 21),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 22),
                                EndDate = new DateTime(2015, 10, 22),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 23),
                                EndDate = new DateTime(2015, 10, 23),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            }
                        }
                    },
                    new User
                    {
                        StaffNumber = 2,
                        Name = "Randy",
                        HolidayAllowance = 25,
                        RemainingAllowance = 17,
                        isVisible = false,
                        HolidayBookings = new List<HolidayBooking>
                        {
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 5),
                                EndDate = new DateTime(2015, 10, 5),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 12),
                                EndDate = new DateTime(2015, 10, 12),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 19),
                                EndDate = new DateTime(2015, 10, 19),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 26),
                                EndDate = new DateTime(2015, 10, 26),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 2),
                                EndDate = new DateTime(2015, 10, 2),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 9),
                                EndDate = new DateTime(2015, 10, 9),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 16),
                                EndDate = new DateTime(2015, 10, 16),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 23),
                                EndDate = new DateTime(2015, 10, 23),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            }
                        }
                    },
                    new User
                    {
                        StaffNumber = 3,
                        Name = "Roger",
                        HolidayAllowance = 25,
                        RemainingAllowance = 15,
                        isVisible = false,
                        HolidayBookings = new List<HolidayBooking>
                        {
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 7),
                                EndDate = new DateTime(2015, 10, 7),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 14),
                                EndDate = new DateTime(2015, 10, 14),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 20),
                                EndDate = new DateTime(2015, 10, 20),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 6),
                                EndDate = new DateTime(2015, 10, 6),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 30),
                                EndDate = new DateTime(2015, 10, 30),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 29),
                                EndDate = new DateTime(2015, 10, 29),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 26),
                                EndDate = new DateTime(2015, 10, 26),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 27),
                                EndDate = new DateTime(2015, 10, 27),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 16),
                                EndDate = new DateTime(2015, 10, 16),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 23),
                                EndDate = new DateTime(2015, 10, 23),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            }
                        }
                    },
                    new User
                    {
                        StaffNumber = 4,
                        Name = "Ronald",
                        HolidayAllowance = 25,
                        RemainingAllowance = 17,
                        isVisible = false,
                        HolidayBookings = new List<HolidayBooking>
                        {
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 19),
                                EndDate = new DateTime(2015, 10, 19),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 20),
                                EndDate = new DateTime(2015, 10, 20),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 21),
                                EndDate = new DateTime(2015, 10, 21),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 22),
                                EndDate = new DateTime(2015, 10, 22),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 23),
                                EndDate = new DateTime(2015, 10, 23),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 7),
                                EndDate = new DateTime(2015, 10, 7),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 8),
                                EndDate = new DateTime(2015, 10, 8),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            },
                            new HolidayBooking
                            {
                                StartDate = new DateTime(2015, 10, 9),
                                EndDate = new DateTime(2015, 10, 9),
                                AllowanceDays = 1,
                                BookingStatus = BookingStatusEnum.Confirmed
                            }
                        }
                    }
                };
            }
        }
    }
}






