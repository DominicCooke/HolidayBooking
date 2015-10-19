using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public class User
    {
        public int StaffNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int HolidayAllowance { get; set; }
        public int RemainingAllowance { get; set; }
        public List<HolidayBooking> HolidayBookings { get; set; }
        public Boolean isVisible { get; set; }
    }
}