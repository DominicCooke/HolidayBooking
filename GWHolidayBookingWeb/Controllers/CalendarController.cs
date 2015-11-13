using System.Collections.Generic;
using System.Web.Http;
using GWHolidayBookingWeb.DataAccess;
using GWHolidayBookingWeb.Models;
using GWHolidayBookingWeb.Services.Employee;

namespace GWHolidayBookingWeb.Controllers
{
    [RoutePrefix("api/Calendar")]
    //[Authorize]
    public class CalendarController : ApiController
    {
        private readonly IEmployeeContext context;
        private readonly IEmployeeDataService employeeService;

        public CalendarController(IEmployeeDataService employeeService, IEmployeeContext context)
        {
            this.employeeService = employeeService;
            this.context = context;
        }

        public List<EmployeeCalendar> GetEmployees()
        {
            return employeeService.Get();
        }

        public EmployeeCalendar GetEmployeeById(int staffId)
        {
            return employeeService.GetEmployeeById(staffId);
        }

        public void UpdateEmployee(EmployeeCalendar employee)
        {
            employeeService.Update(employee);
            context.SaveChanges();
        }

        public void UpdateEmployees(List<EmployeeCalendar> employees)
        {
            foreach (EmployeeCalendar employee in employees)
            {
                employeeService.Update(employee);
                context.SaveChanges();
            }
        }
    }
}