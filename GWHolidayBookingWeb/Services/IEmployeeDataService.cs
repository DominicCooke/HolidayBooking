using System;
using System.Collections.Generic;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Services
{
    public interface IEmployeeDataService
    {
        List<Employee> GetTeam(Guid teamId);
        List<Employee> Get();

        List<PublicHoliday> GetPublicHolidays();
        Employee GetEmployeeById(Guid staffId);
        List<Employee> GetEmployeesByTeamId(Guid teamId);
        void Delete(Guid staffId);
        void UpdateEmployee(UpdateEmployeeViewModel updateEmployeeViewModel);
        void UpdateHolidays(Employee employee);
        void Create(Employee employee);
        void SetTeam(EmployeeSetTeamViewModel employeeSetTeamViewModel);
        EmployeeHolidayBooking GetHolidayBookingById(Guid holidayId);
    }
}