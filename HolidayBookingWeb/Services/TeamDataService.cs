using System;
using System.Collections.Generic;
using HolidayBookingWeb.DataAccess.Repositories;
using HolidayBookingWeb.DataAccess.ViewModels;
using HolidayBookingWeb.Models;

namespace HolidayBookingWeb.Services
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

        public Team GetTeamById(Guid teamId)
        {
            return teamRepository.GetTeamById(teamId);
        }

        public void UpdateTeam(TeamViewModel teamViewModel)
        {
            teamRepository.UpdateTeam(teamViewModel);
        }

        public void DeleteTeam(Guid teamId)
        {
            teamRepository.DeleteTeam(teamId);
        }
    }
}