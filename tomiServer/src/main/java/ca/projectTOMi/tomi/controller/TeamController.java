package ca.projectTOMi.tomi.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.TeamResourceAssembler;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.service.TeamService;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Handles HTTP requests for {@link Team} objects in the ProjectTOMi system.
 *
 * @author Karol Talbot
 * @version 1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class TeamController {
  TeamResourceAssembler assembler;
  TeamService service;

  /**
   * Constructor for this TeamController with parameters required for proper function of this
   * controller.
   *
   * @param assembler
   *   converts team objects into resources
   * @param service
   *   provides services required for {@link Team} objects
   */
  public TeamController(TeamResourceAssembler assembler, TeamService service) {
    this.assembler = assembler;
    this.service = service;
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
    Team team = service.getTeam(id);
    return assembler.toResource(team);
  }

  /**
   * Creates a new {@link Team} with the attributes provided in the POST request to /teams.
   *
   * @param newTeam
   *   a team object with required information.
   *
   * @return response containing links to the newly created team
   *
   * @throws URISyntaxException
   *   when the created URI is unable to be parsed
   */
  @PostMapping ("/teams")
  public ResponseEntity<?> createTeam(@RequestBody Team newTeam) throws URISyntaxException {
    Resource<Team> resource = assembler.toResource(service.saveTeam(newTeam));

    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
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
   * @return response containing a link to the updated team
   *
   * @throws URISyntaxException
   *   when the created URI is unable to be parsed
   */
  @PutMapping ("/teams/{id}")
  public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody Team newTeam) throws URISyntaxException {
    Team updatedTeam = service.updateTeam(id, newTeam);
    Resource<Team> resource = assembler.toResource(updatedTeam);
    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
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
    Team team = service.getTeam(id);
    team.setActive(false);
    service.saveTeam(team);

    return ResponseEntity.noContent().build();
  }
}
