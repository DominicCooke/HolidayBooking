using AutoMapper;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.Models;

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