package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.assembler.UnitTypeResourceAssembler;
import ca.projectTOMi.tomi.model.UnitType;
import ca.projectTOMi.tomi.service.UnitTypeService;
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

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Handles HTTP requests for {@Link UnitType} objects in the ProjectTOMi system.
 *
 * @author Karol Talbot (updated by Iliya Kiritchkov)
 * @version 1.1
 */
@RestController
public class UnitTypeController {
    UnitTypeResourceAssembler assembler;
    UnitTypeService service;

    /**
     * Constructor for this UnitTypeController.
     *
     * @param assembler Converts {@Link UnitType} objects into resources.
     * @param service   Provides services required for UnitType objects.
     */
    public UnitTypeController(UnitTypeResourceAssembler assembler, UnitTypeService service) {
        this.assembler = assembler;
        this.service = service;
    }

    /**
     * Returns a collection of all active {@Link UnitType} objects to the source of a GET request to /unittypes.
     *
     * @return Collection of resources representing all active UnitTypes.
     */
    @GetMapping("/unittypes")
    public Resources<Resource<UnitType>> getActiveUnitTypes() {
        List<Resource<UnitType>> unitType = service.getActiveUnitTypes().stream().map(assembler::toResource).collect(Collectors.toList());

        return new Resources<>(unitType,
                linkTo(methodOn(UnitTypeController.class).getActiveUnitTypes()).withSelfRel());
    }

    /**
     * Returns a collection of all active and billable {@Link UnitType} objects to the source of the GET request to /unittypes/billable.
     *
     * @return Collection of resources representing all active and billable UnitTypes.
     */
    @GetMapping("/unittypes/billable")
    public Resources<Resource<UnitType>> getActiveAndBillableUnitTypes() {
        List<Resource<UnitType>> unitType = service.getActiveAndBillableUnitTypes().stream().map(assembler::toResource).collect(Collectors.toList());

        return new Resources<>(unitType,
                linkTo(methodOn(UnitTypeController.class).getActiveAndBillableUnitTypes()).withSelfRel());
    }

    /**
     * Returns a collection of all active and non-billable {@Link UnitType} objects to the source of the GET request to /unittypes/nonbillable.
     *
     * @return Collection of resources representing all active and non-billable UnitTypes.
     */
    @GetMapping("unittypes/nonbillable")
    public Resources<Resource<UnitType>> getActiveAndNonBillableUnitTypes() {
        List<Resource<UnitType>> unitType = service.getActiveAndNonBillableUnitTypes().stream().map(assembler::toResource).collect(Collectors.toList());

        return new Resources<>(unitType,
                linkTo(methodOn(UnitTypeController.class).getActiveAndNonBillableUnitTypes()).withSelfRel());
    }

    /**
     * Returns a resource representing the requested {@Link UnitType} to the source of a GET request to /unittypes/id.
     *
     * @param id unique identifier for the UnitType.
     * @return Resource representing the UnitType object.
     */
    @GetMapping("unittypes/{id}")
    public Resource<UnitType> getUnitType(@PathVariable Long id) {
        UnitType unitType = service.getUnitType(id);

        return assembler.toResource(unitType);
    }

    /**
     * Creates a new {@Link UnitType} with the attributes provided in the POST request to /unittypes.
     *
     * @param newUnitType a UnitType object with required information.
     * @return response containing links to the newly created UnitType.
     * @throws URISyntaxException when the created URI is unable to be parsed.
     */
    @PostMapping("/unittypes")
    public ResponseEntity<?> createUnitType(@RequestBody UnitType newUnitType) throws URISyntaxException {
        Resource<UnitType> resource = assembler.toResource(service.saveUnitType(newUnitType));

        return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
    }

    /**
     * Updates the attributes for a {@Link UnitType} with the provided id with the attributes provided in the PUT request to /unittypes/id.
     *
     * @param id          the unique identifier for the UnitType to update.
     * @param newUnitType the updated UnitType.
     * @return response containing a link to the updated UnitType.
     * @throws URISyntaxException when the created URI is unable to be parsed.
     */
    @PutMapping("/unittypes/{id}")
    public ResponseEntity<?> updateUnitType(@PathVariable Long id, @RequestBody UnitType newUnitType) throws URISyntaxException {
        UnitType updatedUnitType = service.updateUnitType(id, newUnitType);
        Resource<UnitType> resource = assembler.toResource(updatedUnitType);
        return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
    }

    /**
     * Sets the requested {@Link UnitType}'s active attribute to false, removing it from the list of active UnitTypes.
     * Responds to the DELETE requests to /unittypes/id.
     *
     * @param id the unique identifier for the task to be set inactive.
     * @return a response without any content.
     */
    @DeleteMapping("/unittypes/{id}")
    public ResponseEntity<?> setUnitTypeInactive(@PathVariable Long id) {
        UnitType unitType = service.getUnitType(id);
        unitType.setActive(false);
        service.saveUnitType(unitType);

        return ResponseEntity.noContent().build();
    }
}
