package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

import ca.projectTOMi.tomi.controller.TeamController;
import ca.projectTOMi.tomi.model.Team;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

@Component
public class TeamAssembler implements ResourceAssembler<Team, Resource<Team>>{
  @Override
  public Resource<Team> toResource(Team team) {
    return new Resource<>(team,
      linkTo(methodOn(TeamController.class).getTeam(team.getId())).withSelfRel(),
      linkTo(methodOn(TeamController.class).getActiveTeams()).withRel("teams"));
  }
}
