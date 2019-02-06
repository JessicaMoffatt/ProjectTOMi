package ca.projectTOMi.tomi.assembler;

import ca.projectTOMi.tomi.controller.UnitTypeController;
import ca.projectTOMi.tomi.model.UnitType;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * UniTypeResourceAssembler is responsible for creating a standard resource for {@Link UnitType}.
 *
 * @author Iliya Kiritchkov
 * @version 1.1
 */
@Component
public final class UnitTypeResourceAssembler implements ResourceAssembler<UnitType, Resource<UnitType>> {

    @Override
    public Resource<UnitType> toResource(UnitType unitType) {
        Resource<UnitType> resource = new Resource<>(unitType,
                linkTo(methodOn(UnitTypeController.class).getUnitType(unitType.getId())).withSelfRel(),
                linkTo(methodOn(UnitTypeController.class).getActiveUnitTypes(null)).withRel("unittypes"),
                linkTo(methodOn(UnitTypeController.class).setUnitTypeInactive(unitType.getId())).withRel("delete")
        );

        try {
            resource.add(linkTo(methodOn(UnitTypeController.class).updateUnitType(unitType.getId(), unitType)).withRel("update"));
        } catch (URISyntaxException e) {
            System.out.println(e);
        }

        return resource;
    }
}
