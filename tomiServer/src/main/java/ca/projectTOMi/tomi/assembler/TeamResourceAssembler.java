package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URISyntaxException;
import ca.projectTOMi.tomi.controller.AccountController;
import ca.projectTOMi.tomi.controller.TeamController;
import ca.projectTOMi.tomi.model.Team;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * TeamResourceAssembler is responsible for creating a standard resource for {@link Team} objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Component
public class TeamResourceAssembler implements ResourceAssembler<Team, Resource<Team>> {

  @Override
  public Resource<Team> toResource(Team team) {
    Resource<Team> resource = new Resource<>(team,
      linkTo(methodOn(TeamController.class).getTeam(team.getId())).withSelfRel(),
      linkTo(methodOn(TeamController.class).getActiveTeams()).withRel("teams"),
      linkTo(methodOn(TeamController.class).setTeamInactive(team.getId())).withRel("delete"),
      linkTo(methodOn(AccountController.class).getAccountsByTeam(team.getId())).withRel("getAccounts")
    );

    try {
      resource.add(linkTo(methodOn(TeamController.class).updateTeam(team.getId(), team)).withRel("update"));
    } catch (URISyntaxException e) {
      System.out.println(e);
    }

    return resource;
  }
}