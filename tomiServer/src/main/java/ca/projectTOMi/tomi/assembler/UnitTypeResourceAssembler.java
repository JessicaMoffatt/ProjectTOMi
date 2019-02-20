package ca.projectTOMi.tomi.assembler;

import ca.projectTOMi.tomi.controller.UnitTypeController;
import ca.projectTOMi.tomi.model.UnitType;
import java.net.URISyntaxException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * UniTypeResourceAssembler is responsible for creating a standard resource for {@Link UnitType}.
 *
 * @author Iliya Kiritchkov and Karol Talbot
 * @version 1.2
 */
@Component
public final class UnitTypeResourceAssembler implements ResourceAssembler<UnitType, Resource<UnitType>> {
	private final Logger logger = LoggerFactory.getLogger("UnitType Assembler");

	@Override
	public Resource<UnitType> toResource(final UnitType unitType) {
		final Resource<UnitType> resource = new Resource<>(unitType,
			linkTo(methodOn(UnitTypeController.class).getUnitType(unitType.getId())).withSelfRel(),
			linkTo(methodOn(UnitTypeController.class).getActiveUnitTypes(null)).withRel("unittypes"),
			linkTo(methodOn(UnitTypeController.class).setUnitTypeInactive(unitType.getId())).withRel("delete")
		);

		try {
			resource.add(linkTo(methodOn(UnitTypeController.class).updateUnitType(unitType.getId(), unitType)).withRel("update"));
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}
