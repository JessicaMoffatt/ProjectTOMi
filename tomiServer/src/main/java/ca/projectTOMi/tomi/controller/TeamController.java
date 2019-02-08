package ca.projectTOMi.tomi.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.TeamResourceAssembler;
import ca.projectTOMi.tomi.exception.TeamNotFoundException;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.service.TeamService;
import ca.projectTOMi.tomi.service.UserAccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
  private final TeamService service;
  private final UserAccountService userAccountService;
  private final Logger logger = LoggerFactory.getLogger("Team Controller");

  @Autowired
  public TeamController(TeamResourceAssembler assembler, TeamService service, UserAccountService userAccountService) {
    this.assembler = assembler;
    this.service = service;
    this.userAccountService = userAccountService;
  }

  /**
   * Returns a collection of all active teams the source of a GET request to /teams.
   *
   * @return Collection of resources representing all active teams
   */
  @GetMapping ("/teams")
  public Resources<Resource<Team>> getActiveTeams() {
    List<Resource<Team>> team = service.getActiveTeams().stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(team,
      linkTo(methodOn(TeamController.class).getActiveTeams()).withSelfRel());
  }

  /**
   * Returns a resource representing the requested {@link Team} to the source of a GET request to
   * /teams/id.
   *
   * @param id
   *   unique identifier for the Team
   *
   * @return Resource representing the Team object.
   */
  @GetMapping ("/teams/{id}")
  public Resource<Team> getTeam(@PathVariable Long id) {
    Team team = service.getTeamById(id);
    return assembler.toResource(team);
  }

  /**
   * Creates a new {@link Team} with the attributes provided in the POST request to /teams.
   *
   * @param newTeam
   *   a team object with required information.
   *
   * @return the newly created team
   */
  @PostMapping ("/teams")
  public ResponseEntity<?> createTeam(@RequestBody Team newTeam) throws URISyntaxException {
    Resource<Team> team = assembler.toResource(service.saveTeam(newTeam));
    ResponseEntity<?> response = ResponseEntity.created(new URI(team.getId().expand().getHref())).body(team);
    return response;
  }

  /**
   * Updates the attributes for a {@link Team} with the provided id with the attributes provided in
   * the PUT request to /teams/id.
   *
   * @param id
   *   the unique identifier for the Team to be updated
   * @param newTeam
   *   the updated team
   *
   * @return the updated team
   */
  @PutMapping ("/teams/{id}")
  public Resource<Team> updateTeam(@PathVariable Long id, @RequestBody Team newTeam) {
    Team updatedTeam = service.updateTeam(id, newTeam);
    return assembler.toResource(updatedTeam);
  }

  /**
   * Sets the requested team's active attribute false, removing it from the list of active teams.
   * Responds to the DELETE requests to /teams/id.
   *
   * @param id
   *   the unique identifier for the team to be set inactive
   *
   * @return a response without any content
   */
  @DeleteMapping ("/teams/{id}")
  public ResponseEntity<?> setTeamInactive(@PathVariable Long id) {
    userAccountService.removeAllTeamMembers(id);
    Team team = service.getTeamById(id);
    team.setActive(false);
    team.setTeamLead(null);
    service.saveTeam(team);
    return ResponseEntity.noContent().build();
  }

  @ExceptionHandler({TeamNotFoundException.class})
  public ResponseEntity<?> handleExceptions(Exception e){
    logger.warn("Team Exception: " + e.getClass());
    return ResponseEntity.status(400).build();
  }
}
