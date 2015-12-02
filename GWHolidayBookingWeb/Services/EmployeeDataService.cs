using System;
using System.Collections.Generic;
using GWHolidayBookingWeb.DataAccess.Repositories;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Services
{
    public class EmployeeDataService : IEmployeeDataService
    {
        private readonly IEmployeeRepository employeeRepository;

        public EmployeeDataService(IEmployeeRepository employeeRepository)
        {
            this.employeeRepository = employeeRepository;
        }

        public List<Employee> Get()
        {
            return employeeRepository.Get();
        }

        public List<PublicHoliday> GetPublicHolidays()
        {
            return employeeRepository.GetPublicHolidays();
        }

        public Employee GetEmployeeById(Guid staffId)
        {
            return employeeRepository.GetEmployeeById(staffId);
        }

        public EmployeeHolidayBooking GetHolidayBookingById(int holidayId)
        {
            return employeeRepository.GetHolidayBookingById(holidayId);
        }

        public void Delete(Guid staffId)
        {
            employeeRepository.Delete(staffId);
        }

        public void UpdateEmployee(UpdateEmployeeViewModel updateEmployeeViewModel)
        {
            employeeRepository.UpdateEmployee(updateEmployeeViewModel);
        }

        public void UpdateHolidays(Employee employee)
        {
            employeeRepository.UpdateHolidays(employee);
        }

        public void Create(Employee employee)
        {
            employeeRepository.Create(employee);
        }
    }
}