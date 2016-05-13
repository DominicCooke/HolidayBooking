using AutoMapper;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.App_Start
{
    public static class MappingConfig
    {
        public static void RegisterMapping()
        {
            Mapper.CreateMap<UpdateEmployeeViewModel, Employee>();
            Mapper.CreateMap<Employee, UpdateEmployeeViewModel>();

            Mapper.CreateMap<GetEmployeeByIdViewModel, Employee>();
            Mapper.CreateMap<Employee, GetEmployeeByIdViewModel>();
        }
    }
}