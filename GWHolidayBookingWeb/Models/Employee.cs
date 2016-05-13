using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GWHolidayBookingWeb.Models
{
    public class Employee
    {
        [Key]
        public Guid StaffId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int HolidayAllowance { get; set; }
        public int RemainingAllowance { get; set; }
        public Guid TeamId { get; set; }
        public virtual ICollection<EmployeeHolidayBooking> HolidayBookings { get; set; }
    }
}