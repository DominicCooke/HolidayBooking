using System;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;
using System.Collections.Generic;

namespace GWHolidayBookingWeb.Services
{
    public interface ITeamDataService
    {
        void UpdateTeam(TeamViewModel teamViewModel);
        void CreateTeam(Team team);
        List<Team> GetTeams();
    }
}