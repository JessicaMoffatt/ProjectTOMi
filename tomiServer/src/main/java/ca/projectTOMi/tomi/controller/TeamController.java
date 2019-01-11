package ca.projectTOMi.tomi.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.TeamAssembler;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.service.TeamService;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class TeamController {
  TeamAssembler assembler;
  TeamService service;

  public TeamController(TeamAssembler assembler, TeamService service) {
    this.assembler = assembler;
    this.service = service;
  }

  @GetMapping ("/teams")
  public Resources<Resource<Team>> getActiveTeams() {
    List<Resource<Team>> team = service.getActiveTeams().stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(team,
      linkTo(methodOn(TeamController.class).getActiveTeams()).withSelfRel());
  }

  @GetMapping ("/teams/{id}")
  public Resource<Team> getTeam(@PathVariable Long id) {
    Team team = service.getTeam(id);
    return assembler.toResource(team);
  }

  @PostMapping("/teams")
  public ResponseEntity<?> createTeam(@RequestBody Team newTeam) throws URISyntaxException{
    Resource<Team> resource = assembler.toResource(service.saveTeam(newTeam));

    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  @PutMapping ("/teams/{id}")
  public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody Team newTeam) throws URISyntaxException {
    Team updatedTeam = service.updateTeam(id, newTeam);
    Resource<Team> resource = assembler.toResource(updatedTeam);
    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  @DeleteMapping("/teams/{id}")
  public ResponseEntity<?> setTeamInactive(@PathVariable Long id){
    Team team = service.getTeam(id);
    team.setActive(false);
    service.saveTeam(team);

    return ResponseEntity.noContent().build();
  }
}
