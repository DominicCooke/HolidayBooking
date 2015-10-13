using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public class UserHoliday
    {
        public List<Day> ListOfDays { get; set; }
        public Boolean isVisible { get; set; }
    }
}