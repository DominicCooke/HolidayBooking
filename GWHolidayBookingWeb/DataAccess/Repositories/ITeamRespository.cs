using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

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