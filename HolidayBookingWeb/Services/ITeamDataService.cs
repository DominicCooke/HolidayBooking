using System;
using System.Collections.Generic;
using HolidayBookingWeb.DataAccess.ViewModels;
using HolidayBookingWeb.Models;

namespace HolidayBookingWeb.Services
{
    public interface ITeamDataService
    {
        void UpdateTeam(TeamViewModel teamViewModel);
        void CreateTeam(Team team);
        void DeleteTeam(Guid teamId);
        List<Team> GetTeams();
        Team GetTeamById(Guid teamId);
    }
}