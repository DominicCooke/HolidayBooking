﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using AutoMapper;
using GWHolidayBookingWeb.DataAccess.ViewModels;
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

        public List<Employee> Get()
        {
            return context.Employees.Include("HolidayBookings").ToList();
        }

        public Employee GetEmployeeById(Guid staffId)
        {
            return context.Employees.Include("HolidayBookings").FirstOrDefault(x => x.StaffId == staffId);
        }

        public void Create(Employee employee)
        {
            context.Employees.Add(employee);
            context.SaveChanges();
        }

        public void Delete(Guid staffId)
        {
            Employee employeeInDb = context.Employees.Find(staffId);

            foreach (EmployeeHolidayBooking holidayBooking in employeeInDb.HolidayBookings.ToList())
            {
                context.Entry(holidayBooking).State = EntityState.Deleted;
                employeeInDb.HolidayBookings.Remove(holidayBooking);
            }
            context.Entry(employeeInDb).State = EntityState.Deleted;
            context.SaveChanges();
        }

        public void UpdateEmployee(UpdateEmployeeViewModel updateEmployeeViewModel)
        {
            var employee = Mapper.Map<Employee>(updateEmployeeViewModel);
            Employee employeeInDb = context.Employees.Find(employee.StaffId);
            context.Entry(employeeInDb).CurrentValues.SetValues(employee);
            context.SaveChanges();
        }

        public void UpdateHolidays(Employee employee)
        {
            Employee employeeInDb = context.Employees.Find(employee.StaffId);

            context.Entry(employeeInDb).CurrentValues.SetValues(employee);

            foreach (EmployeeHolidayBooking holidayBooking in employeeInDb.HolidayBookings.ToList())
            {
                if (!employee.HolidayBookings.Any(h => h.HolidayId == holidayBooking.HolidayId))
                {
                    context.Entry(
                        employeeInDb.HolidayBookings.SingleOrDefault(h => h.HolidayId == holidayBooking.HolidayId))
                        .State = EntityState.Deleted;
                    employeeInDb.HolidayBookings.Remove(holidayBooking);
                }
            }

            foreach (EmployeeHolidayBooking holidayBooking in employee.HolidayBookings)
            {
                EmployeeHolidayBooking holidayBookingInDb =
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

        public EmployeeHolidayBooking GetHolidayBookingById(int holidayId)
        {
            return context.HolidayBookings.FirstOrDefault(x => x.HolidayId == holidayId);
        }
    }
}