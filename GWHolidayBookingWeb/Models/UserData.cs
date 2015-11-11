using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GWHolidayBookingWeb.Models
{
    public class UserData
    {
        [Key]
        public int StaffNumber { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int HolidayAllowance { get; set; }
        public int RemainingAllowance { get; set; }
        public virtual ICollection<HolidayBooking> HolidayBookings { get; set; }
    }
}