using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GWHolidayBookingWeb.DataAccess.Repositories;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;

namespace GWHolidayBookingWeb.Services
{
    public class TeamDataService : ITeamDataService
    {
        private readonly ITeamRespository teamRepository;

        public TeamDataService(ITeamRespository teamRepository)
        {
            this.teamRepository = teamRepository;
        }

        public void CreateTeam(Team team)
        {
            teamRepository.CreateTeam(team);
        }

        public List<Team> GetTeams()
        {
            return teamRepository.GetTeams();
        }

        public void UpdateTeam(TeamViewModel teamViewModel)
        {
            teamRepository.UpdateTeam(teamViewModel);
        }
    }
}