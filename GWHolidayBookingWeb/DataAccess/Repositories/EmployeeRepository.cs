using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using AutoMapper;
using GWHolidayBookingWeb.DataAccess.Identity;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly IEmployeeContext context;

        public EmployeeRepository(IEmployeeContext context)
        {
            this.context = context;
        }

        public List<EmployeeCalendar> Get()
        {
            return context.Employees.Include("HolidayBookings").ToList();
        }

        public EmployeeCalendar GetEmployeeById(Guid staffId)
        {
            return context.Employees.Include("HolidayBookings").FirstOrDefault(x => x.StaffId == staffId);
        }

        public void Create(EmployeeCalendar employee)
        {
            context.Employees.Add(employee);
            context.SaveChanges();
        }

        public void Delete(Guid staffId)
        {
            throw new NotImplementedException();
        }

        public void UpdateEmployee(EmployeeCalendarViewModel employeeCalendarViewModel)
        {
            var employee = Mapper.Map<EmployeeCalendar>(employeeCalendarViewModel);
            EmployeeCalendar employeeInDb = context.Employees.Find(employee.StaffId);
            context.Entry(employeeInDb).CurrentValues.SetValues(employee);
            context.SaveChanges();
        }

        public void UpdateHolidays(EmployeeCalendar employee)
        {
            EmployeeCalendar employeeInDb = context.Employees.Find(employee.StaffId);

            context.Entry(employeeInDb).CurrentValues.SetValues(employee);

            foreach (EmployeeCalendarHoldiayBooking holidayBooking in employeeInDb.HolidayBookings.ToList())
            {
                if (!employee.HolidayBookings.Any(h => h.HolidayId == holidayBooking.HolidayId))
                {
                    context.Entry(
                        employeeInDb.HolidayBookings.SingleOrDefault(h => h.HolidayId == holidayBooking.HolidayId))
                        .State = EntityState.Deleted;
                    employeeInDb.HolidayBookings.Remove(holidayBooking);
                }
            }

            foreach (EmployeeCalendarHoldiayBooking holidayBooking in employee.HolidayBookings)
            {
                EmployeeCalendarHoldiayBooking holidayBookingInDb =
                    employeeInDb.HolidayBookings.SingleOrDefault(h => h.HolidayId == holidayBooking.HolidayId);
                if (holidayBookingInDb != null)
                {
                    context.Entry(holidayBookingInDb).CurrentValues.SetValues(holidayBooking);
                }
                else
                {
                    context.HolidayBookings.Attach(holidayBooking);
                    employeeInDb.HolidayBookings.Add(holidayBooking);
                    context.Entry(
                        employeeInDb.HolidayBookings.SingleOrDefault(h => h.HolidayId == holidayBooking.HolidayId))
                        .State = EntityState.Added;
                    context.SaveChanges();
                }
            }
            context.SaveChanges();
        }

        public EmployeeCalendarHoldiayBooking GetHolidayBookingById(int holidayId)
        {
            return context.HolidayBookings.FirstOrDefault(x => x.HolidayId == holidayId);
        }
    }
}