using System;
using System.Collections.Generic;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.DataAccess.Repositories;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Services.Employee
{
    public class EmployeeDataService : IEmployeeDataService
    {
        private readonly IEmployeeRepository employeeRepository;

        public EmployeeDataService(IEmployeeRepository employeeRepository)
        {
            this.employeeRepository = employeeRepository;
        }

        public List<EmployeeCalendar> Get()
        {
            return employeeRepository.Get();
        }

        public EmployeeCalendar GetEmployeeById(Guid staffId)
        {
            return employeeRepository.GetEmployeeById(staffId);
        }

        public EmployeeCalendarHoldiayBooking GetHolidayBookingById(int holidayId)
        {
            return employeeRepository.GetHolidayBookingById(holidayId);
        }

        public void Delete(Guid staffId)
        {
            employeeRepository.Delete(staffId);
        }

        public void UpdateEmployee(EmployeeCalendarViewModel employeeCalendarViewModel)
        {
            employeeRepository.UpdateEmployee(employeeCalendarViewModel);
        }

        public void UpdateHolidays(EmployeeCalendar employee)
        {
            employeeRepository.UpdateHolidays(employee);
        }

        public void Create(EmployeeCalendar employee)
        {
            employeeRepository.Create(employee);
        }
    }
}