package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.authorization.wrapper.UserAuthLinkWrapper;
import ca.projectTOMi.tomi.controller.UnitTypeController;
import ca.projectTOMi.tomi.model.UnitType;
import java.net.URISyntaxException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * UnitTypeResourceAssembler is responsible for creating a standard resource for {@link UnitType}.
 *
 * @author Iliya Kiritchkov
 * @author Karol Talbot
 * @version 1.2
 */
@Component
public final class UnitTypeResourceAssembler implements ResourceAssembler<UserAuthLinkWrapper<UnitType>, Resource<UnitType>> {
	/**
	 * Provides access to the logs for error reporting.
	 */
	private final Logger logger = LoggerFactory.getLogger("UnitType Assembler");

	/**
	 * Converts a UnitType instance into a Resource instance with HATEOAS links based on the requesting
	 * user's {@link ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy}s.
	 *
	 * @param userAuthLinkWrapper
	 * 	a {@link ca.projectTOMi.tomi.model.UnitType} object paired with the {@link
	 * 	ca.projectTOMi.tomi.authorization.manager.AuthManager} created for the request
	 *
	 * @return Resource of the provided UnitType
	 */
	@Override
	public Resource<UnitType> toResource(final UserAuthLinkWrapper<UnitType> userAuthLinkWrapper) {
		final UnitType unitType = userAuthLinkWrapper.getModelObject();
		final Resource<UnitType> resource = new Resource<>(unitType,
			linkTo(methodOn(UnitTypeController.class).getUnitType(unitType.getId(), userAuthLinkWrapper.getManager())).withSelfRel(),
			linkTo(methodOn(UnitTypeController.class).getActiveUnitTypes(userAuthLinkWrapper.getManager())).withRel("unitTypes")

		);

		final Link deleteLink = linkTo(methodOn(UnitTypeController.class).setUnitTypeInactive(unitType.getId())).withRel("delete");
		if (userAuthLinkWrapper.getManager().linkAuthorization(deleteLink.getHref(), "DELETE")) {
			resource.add(deleteLink);
		}

		try {
			final Link updateLink = linkTo(methodOn(UnitTypeController.class).updateUnitType(unitType.getId(), unitType, userAuthLinkWrapper.getManager())).withRel("update");
			if (userAuthLinkWrapper.getManager().linkAuthorization(updateLink.getHref(), "PUT")) {
				resource.add(updateLink);
			}
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}
