using System;
using System.Collections.Generic;
using HolidayBookingWeb.DataAccess.Repositories;
using HolidayBookingWeb.DataAccess.ViewModels;
using HolidayBookingWeb.Models;

namespace HolidayBookingWeb.Services
{
    public class EmployeeDataService : IEmployeeDataService
    {
        private readonly IEmployeeRepository employeeRepository;

        public EmployeeDataService(IEmployeeRepository employeeRepository)
        {
            this.employeeRepository = employeeRepository;
        }

        public List<Employee> GetTeam(Guid teamId)
        {
            return employeeRepository.GetTeam(teamId);
        }

        public List<Employee> Get()
        {
            return employeeRepository.Get();
        }

        public List<Employee> GetEmployeesByTeamId(Guid teamId)
        {
            return employeeRepository.GetEmployeesByTeamId(teamId);
        }

        public List<PublicHoliday> GetPublicHolidays()
        {
            return employeeRepository.GetPublicHolidays();
        }

        public Employee GetEmployeeById(Guid staffId)
        {
            return employeeRepository.GetEmployeeById(staffId);
        }

        public EmployeeHolidayBooking GetHolidayBookingById(Guid holidayId)
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

        public void SetTeam(EmployeeSetTeamViewModel employeeSetTeamViewModel)
        {
            employeeRepository.SetTeam(employeeSetTeamViewModel);
        }
    }
}