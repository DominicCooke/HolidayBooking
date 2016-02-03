using System;
using System.Collections.Generic;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public interface IEmployeeRepository
    {
        List<Employee> GetTeam(Guid teamId);
        List<Employee> Get();
        List<Employee> GetEmployeesByTeamId(Guid teamId);
        List<PublicHoliday> GetPublicHolidays();
        Employee GetEmployeeById(Guid staffId);
        void Create(Employee employee);
        void SetTeam(EmployeeSetTeamViewModel userSetTeamViewModel);
        void Delete(Guid staffId);
        void UpdateEmployee(UpdateEmployeeViewModel updateEmployeeViewModel);
        void UpdateHolidays(Employee employee);
        EmployeeHolidayBooking GetHolidayBookingById(Guid holidayId);
    }
}