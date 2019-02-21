package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.assembler.EntryResourceAssembler;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Handles HTTP requests for {@link Entry} objects in the ProjectTOMi system.
 *
 * @author Iliya Kiritchkov and Karol Talbot
 * @version 1.2
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class EntryController {
	private final EntryResourceAssembler assembler;
	private final EntryService entryService;
	private final Logger logger = LoggerFactory.getLogger("Entry Controller");

	@Autowired
	public EntryController(final EntryResourceAssembler assembler, final EntryService entryService) {
		this.assembler = assembler;
		this.entryService = entryService;
	}

	@GetMapping ("/user_accounts/{userAccountId}/entries/{entryId}")
	public Resource<Entry> getEntry(@PathVariable final Long entryId, @PathVariable final Long userAccountId) {
		final Entry entry = this.entryService.getEntry(entryId);

		return this.assembler.toResource(entry);
	}

	/**
	 * Creates a new {@link Entry} with the attributes provided in the POST request to /entries.
	 *
	 * @param newEntry
	 * 	an Entry object with required information.
	 *
	 * @return response containing links to the newly created Entry.
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed.
	 */
	@PostMapping ("/user_accounts/{userAccountId}/timesheets/{timesheetId}/entries")
	public ResponseEntity<?> createEntry(@RequestBody final Entry newEntry, @PathVariable final Long userAccountId, @PathVariable final Long timesheetId) throws URISyntaxException {
		newEntry.setTimesheet(timesheetId);
		final Resource<Entry> resource = this.assembler.toResource(this.entryService.saveEntry(newEntry));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	@PutMapping ("/user_accounts/{userAccountId}/entries/{entryId}")
	public ResponseEntity<?> updateEntry(@PathVariable final Long entryId, @PathVariable final Long userAccountId, @RequestBody final Entry newEntry) throws URISyntaxException {
		final Entry updatedEntry = this.entryService.updateEntry(entryId, newEntry);
		final Resource<Entry> resource = this.assembler.toResource(updatedEntry);
		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Deletes the {@link Entry} with the provided id. The EntryService determines how to properly
	 * delete the Entry object. Responds to the DELETE requests to /entries/id.
	 *
	 * @param entryId
	 * 	the unique identifier for the Entry to be deleted or set inactive.
	 *
	 * @return a response without any content.
	 */
	@DeleteMapping ("/user_accounts/{userAccountId}/entries/{entryId}")
	public ResponseEntity<?> deleteEntry(@PathVariable final Long entryId, @PathVariable final Long userAccountId) {
		this.entryService.deleteEntry(entryId);

		return ResponseEntity.noContent().build();
	}

	@GetMapping ("/user_accounts/{userAccountId}/timesheets/{timesheetId}/entries")
	public Resources<Resource<Entry>> getAllTimesheetEntries(@PathVariable final Long timesheetId, @PathVariable final Long userAccountId) {
		final List<Resource<Entry>> entry = this.entryService.getEntriesByTimesheet(timesheetId)
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(entry, linkTo(methodOn(EntryController.class).getAllTimesheetEntries(timesheetId, userAccountId)).withSelfRel());
	}

	@PostMapping ("/user_accounts/{userAccountId}/entries/{entryId}/copy")
	public ResponseEntity<?> copyEntry(@PathVariable final Long entryId, @PathVariable final Long userAccountId) throws URISyntaxException {
		final Resource<Entry> resource = this.assembler.toResource(this.entryService.copyEntry(entryId));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	@ExceptionHandler ({EntryNotFoundException.class, IllegalEntryStateException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Entry Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}