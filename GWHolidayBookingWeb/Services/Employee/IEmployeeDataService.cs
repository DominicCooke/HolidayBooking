﻿using System;
using System.Collections.Generic;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Services.Employee
{
    public interface IEmployeeDataService
    {
        List<EmployeeCalendar> Get();
        EmployeeCalendar GetEmployeeById(Guid staffId);
        void Delete(Guid staffId);
        void Update(EmployeeCalendar employee);
        void Create(EmployeeCalendar employee);
        EmployeeCalendarHoldiayBooking GetHolidayBookingById(int holidayId);
    }
}