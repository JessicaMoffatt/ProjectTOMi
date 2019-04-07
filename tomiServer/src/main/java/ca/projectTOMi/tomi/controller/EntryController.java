package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.assembler.EntryResourceAssembler;
import ca.projectTOMi.tomi.authorization.manager.TimesheetAuthManager;
import ca.projectTOMi.tomi.authorization.wrapper.TimesheetAuthLinkWrapper;
import ca.projectTOMi.tomi.exception.EntryNotFoundException;
import ca.projectTOMi.tomi.exception.IllegalEntryStateException;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.service.EntryService;
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
 * Rest Controller that handles HTTP requests for {@link Entry} objects in the TOMi system.
 *
 * @author Iliya Kiritchkov
 * @author Karol Talbot
 * @version 1.2
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class EntryController {
	/**
	 * Converts Entry model objects into HATEOAS Resources objects.
	 */
	private final EntryResourceAssembler assembler;

	/**
	 * Provides services for maintaining Entry and Timesheet objects.
	 */
	private final EntryService entryService;

	/**
	 * Provides access to the system logs for reporting errors.
	 */
	private final Logger logger = LoggerFactory.getLogger("Entry Controller");

	/**
	 * Creates the EntryController.
	 *
	 * @param assembler
	 * 	Converts Entry model objects into Resources
	 * @param entryService
	 * 	Provides services for maintaining Entry and Timesheet objects
	 */
	@Autowired
	public EntryController(final EntryResourceAssembler assembler, final EntryService entryService) {
		this.assembler = assembler;
		this.entryService = entryService;
	}

	/**
	 * Gets the requested {@link Entry} in response to the GET request to /entries/id.
	 *
	 * @param id
	 * 	The unique identifier for the requested entry
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Resource for the requested Entry
	 */
	@GetMapping ("/entries/{id}")
	public Resource<Entry> getEntry(@PathVariable final Long id,
	                                @RequestAttribute final TimesheetAuthManager authMan) {
		final Entry entry = this.entryService.getEntry(id);

		return this.assembler.toResource(new TimesheetAuthLinkWrapper<>(entry, authMan));
	}

	/**
	 * Creates a new {@link Entry} with the attributes provided in the POST request to /entries.
	 *
	 * @param newEntry
	 * 	an Entry object with required information.
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return response containing links to the newly created Entry.
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed.
	 */
	@PostMapping ("/entries")
	public ResponseEntity<?> createEntry(@RequestBody final Entry newEntry,
	                                     @RequestAttribute final TimesheetAuthManager authMan) throws URISyntaxException {
		final Resource<Entry> resource = this.assembler.toResource(new TimesheetAuthLinkWrapper<>(this.entryService.saveEntry(newEntry), authMan));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Updates the requested {@link Entry} with the Entry provided as the body of the PUT request to
	 * /entries/id.
	 *
	 * @param id
	 * 	The unique identifier for the requested Entry
	 * @param newEntry
	 * 	The Entry contained in the body of the HTTP request
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Resource representing the updated Entry
	 *
	 * @throws URISyntaxException
	 * 	When the URI constructed by the assembler fails to conform to URI standards
	 */
	@PutMapping ("/entries/{id}")
	public ResponseEntity<?> updateEntry(@PathVariable final Long id,
	                                     @RequestBody final Entry newEntry,
	                                     @RequestAttribute final TimesheetAuthManager authMan) throws URISyntaxException {
		final Entry updatedEntry = this.entryService.updateEntry(id, newEntry);
		final Resource<Entry> resource = this.assembler.toResource(new TimesheetAuthLinkWrapper<>(updatedEntry, authMan));
		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Deletes the requested Entry.
	 *
	 * @param id
	 * 	The unique identifier for the Entry to be deleted
	 *
	 * @return Empty response to confirm the deletion of the requested entry
	 */
	@DeleteMapping ("/entries/{id}")
	public ResponseEntity<?> deleteEntry(@PathVariable final Long id) {
		this.entryService.deleteEntry(id);

		return ResponseEntity.noContent().build();
	}

	/**
	 * Gets all the Entries associated with a requested timesheet.
	 *
	 * @param id
	 * 	The unique identifier for the timesheet
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return List of Resources representing the entries for the requested Timesheet
	 */
	@GetMapping ("/timesheets/{id}/entries")
	public Resources<Resource<Entry>> getAllTimesheetEntries(@PathVariable final Long id,
	                                                         @RequestAttribute final TimesheetAuthManager authMan) {
		final List<Resource<Entry>> entryList = this.entryService.getEntriesByTimesheet(id)
			.stream()
			.map((entry -> new TimesheetAuthLinkWrapper<>(entry, authMan)))
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(entryList, linkTo(methodOn(EntryController.class).getAllTimesheetEntries(id, authMan)).withSelfRel());
	}

	/**
	 * Creates a partial copy of the requested entry.
	 *
	 * @param id
	 * 	The unique identifier for the entry to be copied
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return The partial copy created from the requested entry
	 *
	 * @throws URISyntaxException
	 * 	When the URI constructed by the assembler fails to conform to URI standards
	 */
	@PostMapping ("/entries/{id}/copy")
	public ResponseEntity<?> copyEntry(@PathVariable final Long id,
	                                   @RequestAttribute final TimesheetAuthManager authMan) throws URISyntaxException {
		final Resource<Entry> resource = this.assembler.toResource(new TimesheetAuthLinkWrapper<>(this.entryService.copyEntry(id), authMan));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Informs the client that an exception has occurred. In order to keep the server inner workings
	 * private a generic 400 bad request is used.
	 *
	 * @param e
	 * 	The exception that had occurred
	 *
	 * @return A 400 Bad Request Response
	 */
	@ExceptionHandler ({EntryNotFoundException.class, IllegalEntryStateException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Entry Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}