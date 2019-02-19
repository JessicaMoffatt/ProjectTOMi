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
 * @author Iliya Kiritchkov
 * @version 1.1
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

	/**
	 * Returns a resource representing the requested {@link Entry} to the source of a GET request to
	 * /entries/id.
	 *
	 * @param id
	 * 	unique identifier for the Entry.
	 *
	 * @return Resource representing the Entry object.
	 */
	@GetMapping ("/entries/{id}")
	public Resource<Entry> getEntry(@PathVariable final Long id) {
		final Entry entry = this.entryService.getEntry(id);

		return this.assembler.toResource(entry);
	}

	/**
	 * Returns a collection of all active {@link Entry} objects to the source of a GET request to
	 * /entries.
	 *
	 * @return Collection of resources representing all active Entries.
	 */
	@GetMapping ("/entries")
	public Resources<Resource<Entry>> getActiveEntries() {
		final List<Resource<Entry>> entry = this.entryService.getActiveEntries()
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(entry, linkTo(methodOn(EntryController.class).getActiveEntries()).withSelfRel());
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
	@PostMapping ("/entries")
	public ResponseEntity<?> createEntry(@RequestBody final Entry newEntry) throws URISyntaxException {
		final Resource<Entry> resource = this.assembler.toResource(this.entryService.saveEntry(newEntry));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Updates the attributes for a {@link Entry} with the provided id with the attributes provided in
	 * the PUT request to /entries/id.
	 *
	 * @param id
	 * 	the unique identifier for the Entry to update.
	 * @param newEntry
	 * 	the updated Entry.
	 *
	 * @return response containing a link to the updated Entry.
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed.
	 */
	@PutMapping ("/entries/{id}")
	public ResponseEntity<?> updateEntry(@PathVariable final Long id, @RequestBody final Entry newEntry) throws URISyntaxException {
		final Entry updatedEntry = this.entryService.updateEntry(id, newEntry);
		final Resource<Entry> resource = this.assembler.toResource(updatedEntry);
		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Deletes the {@link Entry} with the provided id. The EntryService determines how to properly
	 * delete the Entry object. Responds to the DELETE requests to /entries/id.
	 *
	 * @param id
	 * 	the unique identifier for the Entry to be deleted or set inactive.
	 *
	 * @return a response without any content.
	 */
	@DeleteMapping ("/entries/{id}")
	public ResponseEntity<?> deleteEntry(@PathVariable final Long id) {
		this.entryService.deleteEntry(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping ("/timesheets/{id}/entries")
	public Resources<Resource<Entry>> getAllTimesheetEntries(@PathVariable final Long id) {
		final List<Resource<Entry>> entry = this.entryService.getEntriesByTimesheet(id)
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(entry, linkTo(methodOn(EntryController.class).getActiveEntries()).withSelfRel());
	}

	@PostMapping ("/entries/{id}/copy")
	public ResponseEntity<?> copyEntry(@PathVariable final Long id) throws URISyntaxException {
		final Resource<Entry> resource = this.assembler.toResource(this.entryService.copyEntry(id));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	@ExceptionHandler ({EntryNotFoundException.class, IllegalEntryStateException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Entry Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}