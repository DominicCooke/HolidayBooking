using System.Collections.Generic;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public interface IEmployeeRepository
    {
        List<EmployeeCalendar> Get();
        EmployeeCalendar GetEmployeeById(int staffId);
        void Create(EmployeeCalendar employee);
        void Delete(int staffId);
        void Update(EmployeeCalendar employee);
        EmployeeCalendarHoldiayBooking GetHolidayBookingById(int holidayId);
    }
}