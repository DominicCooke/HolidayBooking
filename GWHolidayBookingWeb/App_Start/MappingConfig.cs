using AutoMapper;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.App_Start
{
    public static class MappingConfig
    {
        public static void RegisterMapping()
        {
            Mapper.CreateMap<EmployeeCalendarViewModel, EmployeeCalendar>();
            Mapper.CreateMap<EmployeeCalendar, EmployeeCalendarViewModel>();

            Mapper.CreateMap<UserStartupViewModel, EmployeeCalendar>();
            Mapper.CreateMap<EmployeeCalendar, UserStartupViewModel>();
        }
    }
}