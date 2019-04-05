package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.assembler.UnitTypeResourceAssembler;
import ca.projectTOMi.tomi.authorization.manager.UserAuthManager;
import ca.projectTOMi.tomi.authorization.wrapper.UserAuthLinkWrapper;
import ca.projectTOMi.tomi.exception.UnitTypeNotFoundException;
import ca.projectTOMi.tomi.model.UnitType;
import ca.projectTOMi.tomi.service.UnitTypeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;


import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Handles HTTP requests for {@link UnitType} objects in the ProjectTOMi system.
 *
 * @author Karol Talbot
 * @author Iliya Kiritchkov
 * @version 1.2
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class UnitTypeController {
	private final UnitTypeResourceAssembler assembler;
	private final UnitTypeService unitTypeService;
	private final Logger logger = LoggerFactory.getLogger("UnitType Controller");

	@Autowired
	public UnitTypeController(final UnitTypeResourceAssembler assembler, final UnitTypeService unitTypeService) {
		this.assembler = assembler;
		this.unitTypeService = unitTypeService;
	}

	@GetMapping ("/unit_types")
	public Resources<Resource<UnitType>> getActiveUnitTypes(@RequestAttribute final UserAuthManager authMan) {
		final List<Resource<UnitType>> unitTypeList = this.unitTypeService.getActiveUnitTypes()
			.stream()
			.map(unitType -> new UserAuthLinkWrapper<>(unitType, authMan))
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(unitTypeList,
			linkTo(methodOn(UnitTypeController.class).getActiveUnitTypes(authMan)).withSelfRel());
	}

	/**
	 * Returns a resource representing the requested {@link UnitType} to the source of a GET request
	 * to /unit_types/id.
	 *
	 * @param id
	 * 	unique identifier for the UnitType.
	 *
	 * @return Resource representing the UnitType object.
	 */
	@GetMapping ("unit_types/{id}")
	public Resource<UnitType> getUnitType(@PathVariable final Long id,
	                                      @RequestAttribute final UserAuthManager authMan) {
		return this.assembler.toResource(
			new UserAuthLinkWrapper<>(this.unitTypeService.getUnitType(id), authMan));
	}

	/**
	 * Creates a new {@link UnitType} with the attributes provided in the POST request to
	 * /unit_types.
	 *
	 * @param newUnitType
	 * 	a UnitType object with required information.
	 *
	 * @return response containing links to the newly created UnitType.
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed.
	 */
	@PostMapping ("/unit_types")
	public ResponseEntity<?> createUnitType(@RequestBody final UnitType newUnitType,
	                                        @RequestAttribute final UserAuthManager authMan) throws URISyntaxException {
		newUnitType.setActive(true);
		final Resource<UnitType> resource = this.assembler.toResource(
			new UserAuthLinkWrapper<>(this.unitTypeService.createUnitType(newUnitType), authMan));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Updates the attributes for a {@link UnitType} with the provided id with the attributes provided
	 * in the PUT request to /unit_types/id.
	 *
	 * @param id
	 * 	the unique identifier for the UnitType to update.
	 * @param newUnitType
	 * 	the updated UnitType.
	 *
	 * @return response containing a link to the updated UnitType.
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed.
	 */
	@PutMapping ("/unit_types/{id}")
	public ResponseEntity<?> updateUnitType(@PathVariable final Long id,
	                                        @RequestBody final UnitType newUnitType,
	                                        @RequestAttribute final UserAuthManager authMan) throws URISyntaxException {
		final UnitType updatedUnitType = this.unitTypeService.updateUnitType(id, newUnitType);
		final Resource<UnitType> resource = this.assembler.toResource(
			new UserAuthLinkWrapper<>(updatedUnitType, authMan));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Sets the requested {@link UnitType}'s active attribute to false, removing it from the list of
	 * active UnitTypes. Responds to the DELETE requests to /unit_types/id.
	 *
	 * @param id
	 * 	the unique identifier for the task to be set inactive.
	 *
	 * @return a response without any content.
	 */
	@DeleteMapping ("/unit_types/{id}")
	public ResponseEntity<?> setUnitTypeInactive(@PathVariable final Long id) {
		final UnitType unitType = this.unitTypeService.getUnitType(id);
		this.unitTypeService.deleteUnitType(unitType);

		return ResponseEntity.noContent().build();
	}

	@ExceptionHandler ({UnitTypeNotFoundException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("UnitType Exception: " + e.getClass());

		return ResponseEntity.status(400).build();
	}
}
