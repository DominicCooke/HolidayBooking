using System.Collections.Generic;
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

        public EmployeeCalendar GetEmployeeById(int staffId)
        {
            return employeeRepository.GetEmployeeById(staffId);
        }

        public EmployeeCalendarHoldiayBooking GetHolidayBookingById(int holidayId)
        {
            return employeeRepository.GetHolidayBookingById(holidayId);
        }

        public void Delete(int staffId)
        {
            employeeRepository.Delete(staffId);
        }

        public void Update(EmployeeCalendar employee)
        {
            if (employee.StaffId == 0)
            {
                employeeRepository.Create(employee);
            }
            else
            {
                employeeRepository.Update(employee);
            }
        }
    }
}