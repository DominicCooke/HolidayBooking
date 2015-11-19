using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.Models;
using AutoMapper;

namespace GWHolidayBookingWeb.App_Start
{
        public static class MappingConfig
        {
            public static void RegisterMapping()
            {
                Mapper.CreateMap<EmployeeCalendarViewModel, EmployeeCalendar>();
                Mapper.CreateMap<EmployeeCalendar, EmployeeCalendarViewModel>();
            }
        }
}