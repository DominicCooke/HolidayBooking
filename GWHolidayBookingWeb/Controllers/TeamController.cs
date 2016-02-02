using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using GWHolidayBookingWeb.DataAccess.ViewModels;
using GWHolidayBookingWeb.Models;
using GWHolidayBookingWeb.Services;

namespace GWHolidayBookingWeb.Controllers
{
    [Authorize]
    [RoutePrefix("api/Team")]
    public class TeamController: ApiController
    {
        private readonly ITeamDataService teamDataService;

        public TeamController(ITeamDataService teamDataService)
        {
            this.teamDataService = teamDataService;
        }

        [Route("GetTeams")]
        public List<Team> GetTeams()
        {
            return teamDataService.GetTeams();
        }

        [Route("CreateTeam")]
        public IHttpActionResult CreateTeam(CreateTeamViewModel createTeamViewModel)
        {
            Team team = new Team();
            team.TeamId = Guid.NewGuid();
            team.TeamName = createTeamViewModel.TeamName;
            teamDataService.CreateTeam(team);
            return Ok();
        }
        [Route("UpdateTeam")]
        public IHttpActionResult UpdateTeam(TeamViewModel teamViewModel)
        {
            teamDataService.UpdateTeam(teamViewModel);
            return Ok();
        }
    }
}