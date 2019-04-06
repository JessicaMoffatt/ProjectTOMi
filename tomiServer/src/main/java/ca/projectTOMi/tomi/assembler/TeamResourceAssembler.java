package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.authorization.wrapper.UserAuthLinkWrapper;
import ca.projectTOMi.tomi.controller.UserAccountController;
import ca.projectTOMi.tomi.controller.TeamController;
import ca.projectTOMi.tomi.model.Team;
import org.springframework.hateoas.Link;
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
public final class TeamResourceAssembler implements ResourceAssembler<UserAuthLinkWrapper<Team>, Resource<Team>> {

	/**
	 * Converts a Team instance into a Resource instance with HATEOAS links based on the requesting
	 * user's {@link ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy}s.
	 *
	 * @param authLinkWrapper
	 * 	a {@link ca.projectTOMi.tomi.model.Team} object paired with the {@link
	 * 	ca.projectTOMi.tomi.authorization.manager.AuthManager} created for the request
	 *
	 * @return Resource of the provided Team
	 */
	@Override
	public Resource<Team> toResource(final UserAuthLinkWrapper<Team> authLinkWrapper) {
		final Team team = authLinkWrapper.getModelObject();
		final Resource<Team> resource = new Resource<>(team,
			linkTo(methodOn(TeamController.class).getTeam(team.getId(), authLinkWrapper.getManager())).withSelfRel(),
			linkTo(methodOn(TeamController.class).getActiveTeams(authLinkWrapper.getManager())).withRel("teams"),
			linkTo(methodOn(UserAccountController.class).getAccountsByTeam(team.getId(), authLinkWrapper.getManager())).withRel("getAccounts"),
			linkTo(methodOn(UserAccountController.class).getTeamLead(team.getId(), authLinkWrapper.getManager())).withRel("getTeamLead"),
			linkTo(methodOn(UserAccountController.class).getUnassignedUserAccounts(authLinkWrapper.getManager())).withRel("getUnassignedAccounts")
		);

		final Link deleteLink = linkTo(methodOn(TeamController.class).setTeamInactive(team.getId())).withRel("delete");
		if (authLinkWrapper.getManager().linkAuthorization(deleteLink.getHref(), "DELETE")) {
			resource.add(deleteLink);
		}

		final Link updateLink = linkTo(methodOn(TeamController.class).updateTeam(team.getId(), team, authLinkWrapper.getManager())).withRel("update");
		if (authLinkWrapper.getManager().linkAuthorization(updateLink.getHref(), "PUT")) {
			resource.add(updateLink);
		}

		return resource;
	}
}
