package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.controller.UserAccountController;
import ca.projectTOMi.tomi.controller.TeamController;
import ca.projectTOMi.tomi.model.Team;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * TeamResourceAssembler is responsible for creating a standard resource for {@link Team} objects.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Component
public final class TeamResourceAssembler implements ResourceAssembler<Team, Resource<Team>> {

  @Override
  public Resource<Team> toResource(Team team) {
    Resource<Team> resource = new Resource<>(team,
      linkTo(methodOn(TeamController.class).getTeam(team.getId())).withSelfRel(),
      linkTo(methodOn(TeamController.class).getActiveTeams()).withRel("teams"),
      linkTo(methodOn(TeamController.class).setTeamInactive(team.getId())).withRel("delete"),
      linkTo(methodOn(UserAccountController.class).getAccountsByTeam(team.getId())).withRel("getAccounts"),
      linkTo(methodOn(UserAccountController.class).getTeamLead(team.getId())).withRel("getTeamLead"),
      linkTo(methodOn(TeamController.class).updateTeam(team.getId(), team)).withRel("update")
    );

    return resource;
  }
}
