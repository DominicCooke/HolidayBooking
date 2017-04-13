using AutoMapper;
using HolidayBookingWeb.DataAccess.ViewModels;
using HolidayBookingWeb.Models;


namespace HolidayBookingWeb
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