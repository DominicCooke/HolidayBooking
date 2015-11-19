using System;
using System.Collections.Generic;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public interface IEmployeeRepository
    {
        List<EmployeeCalendar> Get();
        EmployeeCalendar GetEmployeeById(Guid staffId);
        void Create(EmployeeCalendar employee);
        void Delete(Guid staffId);
        void UpdateEmployee(EmployeeCalendarViewModel employeeCalendarViewModel);
        void UpdateHolidays(EmployeeCalendar employee);
        EmployeeCalendarHoldiayBooking GetHolidayBookingById(int holidayId);
    }
}