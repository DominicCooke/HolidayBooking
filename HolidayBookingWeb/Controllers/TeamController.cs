using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using HolidayBookingWeb.DataAccess.ViewModels;
using HolidayBookingWeb.Models;
using HolidayBookingWeb.Services;

namespace HolidayBookingWeb.Controllers
{
    [Authorize]
    [RoutePrefix("api/Team")]
    public class TeamController : ApiController
    {
        private readonly IEmployeeDataService employeeDataService;
        private readonly ITeamDataService teamDataService;

        public TeamController(ITeamDataService teamDataService, IEmployeeDataService employeeDataService)
        {
            this.teamDataService = teamDataService;
            this.employeeDataService = employeeDataService;
        }

        [Route("GetTeams")]
        public List<Team> GetTeams()
        {
            return teamDataService.GetTeams();
        }

        [Route("CreateTeam")]
        public IHttpActionResult CreateTeam(CreateTeamViewModel createTeamViewModel)
        {
            var team = new Team();
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

        [Route("DeleteTeam")]
        [HttpPost]
        public HttpResponseMessage DeleteTeam(TeamViewModel team)
        {
            var listOfEmployeesInTeam = employeeDataService.GetEmployeesByTeamId(team.TeamId);
            if (listOfEmployeesInTeam.Count > 0)
            {
                var message =
                    string.Format("The team {0} has {1} member (s) in it. The team must be empty to be deleted.",
                        team.TeamName, listOfEmployeesInTeam.Count());
                return Request.CreateResponse(HttpStatusCode.OK, message);
            }
            teamDataService.DeleteTeam(team.TeamId);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}