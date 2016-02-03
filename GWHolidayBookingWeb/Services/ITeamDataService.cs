using System;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace GWHolidayBookingWeb.Services
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