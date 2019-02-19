package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.assembler.UnitTypeResourceAssembler;
import ca.projectTOMi.tomi.exception.UnitTypeNotFoundException;
import ca.projectTOMi.tomi.model.UnitType;
import ca.projectTOMi.tomi.service.UnitTypeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
 * @author Karol Talbot and Iliya Kiritchkov
 * @version 1.2
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class UnitTypeController {
    private final UnitTypeResourceAssembler assembler;
    private final UnitTypeService service;
    private final Logger logger = LoggerFactory.getLogger("UnitType Controller");

    @Autowired
    public UnitTypeController(UnitTypeResourceAssembler assembler, UnitTypeService service) {
        this.assembler = assembler;
        this.service = service;
    }

    /**
     * Returns a collection of all active {@Link UnitType} objects to the source of a GET request to /unit_types.
     *
     * @param head header component of the HTTP request
     *
     * @return Collection of resources representing all active UnitTypes.
     */
    @GetMapping("/unit_types")
    public Resources<Resource<UnitType>> getActiveUnitTypes(@RequestHeader HttpHeaders head) {
        List<Resource<UnitType>> unitType = service.getActiveUnitTypes().stream().map(assembler::toResource).collect(Collectors.toList());

        return new Resources<>(unitType,
                linkTo(methodOn(UnitTypeController.class).getActiveUnitTypes(null)).withSelfRel());
    }

    /**
     * Returns a resource representing the requested {@Link UnitType} to the source of a GET request to /unit_types/id.
     *
     * @param id unique identifier for the UnitType.
     * @return Resource representing the UnitType object.
     */
    @GetMapping("unit_types/{id}")
    public Resource<UnitType> getUnitType(@PathVariable Long id) {
        UnitType unitType = service.getUnitType(id);

        return assembler.toResource(unitType);
    }

    /**
     * Creates a new {@Link UnitType} with the attributes provided in the POST request to /unit_types.
     *
     * @param newUnitType a UnitType object with required information.
     * @return response containing links to the newly created UnitType.
     * @throws URISyntaxException when the created URI is unable to be parsed.
     */
    @PostMapping("/unit_types")
    public ResponseEntity<?> createUnitType(@RequestBody UnitType newUnitType) throws URISyntaxException {
        Resource<UnitType> resource = assembler.toResource(service.saveUnitType(newUnitType));

        return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
    }

    /**
     * Updates the attributes for a {@Link UnitType} with the provided id with the attributes provided in the PUT request to /unit_types/id.
     *
     * @param id          the unique identifier for the UnitType to update.
     * @param newUnitType the updated UnitType.
     * @return response containing a link to the updated UnitType.
     * @throws URISyntaxException when the created URI is unable to be parsed.
     */
    @PutMapping("/unit_types/{id}")
    public ResponseEntity<?> updateUnitType(@PathVariable Long id, @RequestBody UnitType newUnitType) throws URISyntaxException {
        UnitType updatedUnitType = service.updateUnitType(id, newUnitType);
        Resource<UnitType> resource = assembler.toResource(updatedUnitType);
        return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
    }

    /**
     * Sets the requested {@Link UnitType}'s active attribute to false, removing it from the list of active UnitTypes.
     * Responds to the DELETE requests to /unit_types/id.
     *
     * @param id the unique identifier for the task to be set inactive.
     * @return a response without any content.
     */
    @DeleteMapping("/unit_types/{id}")
    public ResponseEntity<?> setUnitTypeInactive(@PathVariable Long id) {
        UnitType unitType = service.getUnitType(id);
        unitType.setActive(false);
        service.saveUnitType(unitType);

        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler({UnitTypeNotFoundException.class})
    public ResponseEntity<?> handleExceptions(Exception e){
        logger.warn("UnitType Exception: " + e.getClass());
        return ResponseEntity.status(400).build();
    }
}
