using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using HolidayBookingWeb.DataAccess.ViewModels;
using HolidayBookingWeb.Models;


namespace HolidayBookingWeb.DataAccess.Repositories
{
    public interface ITeamRespository
    {
        List<Team> GetTeams();
        Team GetTeamById(Guid TeamId);
        void CreateTeam(Team team);
        void SetTeam(EmployeeSetTeamViewModel userSetTeamViewModel);
        void UpdateTeam(TeamViewModel teamViewModel);
        void DeleteTeam(Guid teamId);
    }

    public class TeamRespository : ITeamRespository
    {
        private readonly IEmployeeContext context;

        public TeamRespository(IEmployeeContext context)
        {
            this.context = context;
        }

        public Team GetTeamById(Guid teamId)
        {
            return context.Teams.FirstOrDefault(x => x.TeamId == teamId);
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

        public void DeleteTeam(Guid teamId)
        {
            var teamInDb = context.Teams.Find(teamId);
            context.Entry(teamInDb).State = EntityState.Deleted;
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