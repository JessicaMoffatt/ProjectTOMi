package ca.projectTOMi.tomi.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.TeamResourceAssembler;
import ca.projectTOMi.tomi.authorization.manager.UserAuthManager;
import ca.projectTOMi.tomi.authorization.wrapper.UserAuthLinkWrapper;
import ca.projectTOMi.tomi.exception.TeamNotFoundException;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.service.TeamService;
import ca.projectTOMi.tomi.service.UserAccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Handles HTTP requests for {@link Team} objects in the ProjectTOMi system.
 *
 * @author Karol Talbot
 * @version 1.2
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class TeamController {

	private final TeamResourceAssembler assembler;
	private final TeamService teamService;
	private final UserAccountService userAccountService;
	private final Logger logger = LoggerFactory.getLogger("Team Controller");

	@Autowired
	public TeamController(final TeamResourceAssembler assembler, final TeamService teamService, final UserAccountService userAccountService) {
		this.assembler = assembler;
		this.teamService = teamService;
		this.userAccountService = userAccountService;
	}

	/**
	 * Returns a collection of all active teams the source of a GET request to /teams.
	 *
	 * @return Collection of resources representing all active teams
	 */
	@GetMapping ("/teams")
	public Resources<Resource<Team>> getActiveTeams(@RequestAttribute final UserAuthManager authMan) {
		final List<Resource<Team>> teamList = this.teamService.getActiveTeams()
			.stream()
			.map(team -> new UserAuthLinkWrapper<>(team, authMan))
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(teamList,
			linkTo(methodOn(TeamController.class).getActiveTeams(null)).withSelfRel());
	}

	/**
	 * Returns a resource representing the requested {@link Team} to the source of a GET request to
	 * /teams/id.
	 *
	 * @param teamId
	 * 	unique identifier for the Team
	 *
	 * @return Resource representing the Team object.
	 */
	@GetMapping ("/teams/{teamId}")
	public Resource<Team> getTeam(@PathVariable final Long teamId,
	                              @RequestAttribute final UserAuthManager authMan) {
		final Team team = this.teamService.getTeamById(teamId);
		return this.assembler.toResource(new UserAuthLinkWrapper<>(team, authMan));
	}

	/**
	 * Creates a new {@link Team} with the attributes provided in the POST request to /teams.
	 *
	 * @param newTeam
	 * 	a team object with required information.
	 *
	 * @return the newly created team
	 */
	@PostMapping ("/teams")
	public ResponseEntity<?> createTeam(@RequestBody final Team newTeam,
	                                    @RequestAttribute final UserAuthManager authMan) throws URISyntaxException {
		final Resource<Team> team = this.assembler.toResource(new UserAuthLinkWrapper<>(this.teamService.createTeam(newTeam), authMan));

		return ResponseEntity.created(new URI(team.getId().expand().getHref())).body(team);

	}

	/**
	 * Updates the attributes for a {@link Team} with the provided id with the attributes provided in
	 * the PUT request to /teams/id.
	 *
	 * @param teamId
	 * 	the unique identifier for the Team to be updated
	 * @param newTeam
	 * 	the updated team
	 *
	 * @return the updated team
	 */
	@PutMapping ("/teams/{teamId}")
	public Resource<Team> updateTeam(@PathVariable final Long teamId,
	                                 @RequestBody final Team newTeam,
	                                 @RequestAttribute final UserAuthManager authMan) {
		final Team updatedTeam = this.teamService.updateTeam(teamId, newTeam);

		return this.assembler.toResource(new UserAuthLinkWrapper<>(updatedTeam, authMan));
	}

	/**
	 * Sets the requested team's active attribute false, removing it from the list of active teams.
	 * Responds to the DELETE requests to /teams/id.
	 *
	 * @param teamId
	 * 	the unique identifier for the team to be set inactive
	 *
	 * @return a response without any content
	 */
	@DeleteMapping ("/teams/{teamId}")
	public ResponseEntity<?> setTeamInactive(@PathVariable final Long teamId) {
		this.userAccountService.removeAllTeamMembers(teamId);
		this.teamService.deleteTeam(teamId);

		return ResponseEntity.noContent().build();
	}

	@ExceptionHandler ({TeamNotFoundException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Team Exception: " + e.getClass());

		return ResponseEntity.status(400).build();
	}
}
