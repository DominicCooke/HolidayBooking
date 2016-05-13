using System;
using System.Collections.Generic;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.DataAccess.Repositories
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
}