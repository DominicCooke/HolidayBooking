using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.DataAccess.Repositories
{
    public interface ITeamRespository
    {
        List<Team> GetTeams();
        void CreateTeam(Team team);
        void SetTeam(EmployeeSetTeamViewModel userSetTeamViewModel);
        void UpdateTeam(TeamViewModel teamViewModel);
    }
}