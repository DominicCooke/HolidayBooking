using System.Collections.Generic;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Services.Employee
{
    public interface IEmployeeDataService
    {
        List<EmployeeCalendar> Get();
        EmployeeCalendar GetEmployeeById(int staffId);
        void Delete(int staffId);
        void Update(EmployeeCalendar employee);
        EmployeeCalendarHoldiayBooking GetHolidayBookingById(int holidayId);
    }
}