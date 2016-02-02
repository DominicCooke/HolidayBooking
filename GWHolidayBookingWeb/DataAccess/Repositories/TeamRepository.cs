using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using AutoMapper;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public class TeamRespository : ITeamRespository
    {
        private readonly IEmployeeContext context;

        public TeamRespository(IEmployeeContext context)
        {
            this.context = context;
        }

        public List<Team> GetTeams()
        {
            return context.Teams.ToList();
        }

        public void CreateTeam(Team team)
        {
            context.Teams.Add(team);
            context.SaveChanges();
        }
        public void SetTeam(EmployeeSetTeamViewModel employeeSetTeamViewModel)
        {
            var employeeInDb = context.Employees.Find(employeeSetTeamViewModel.Employee.StaffId);
            employeeSetTeamViewModel.Employee.TeamId = employeeSetTeamViewModel.Team.TeamId;
            context.Entry(employeeInDb).CurrentValues.SetValues(employeeSetTeamViewModel.Employee);
            context.SaveChanges();
        }

        public void UpdateTeam(TeamViewModel teamViewModel)
        {
            var teamInDb = context.Teams.Find(teamViewModel.TeamId);
            context.Entry(teamInDb).CurrentValues.SetValues(teamViewModel);
            context.SaveChanges();
        }
    }
}