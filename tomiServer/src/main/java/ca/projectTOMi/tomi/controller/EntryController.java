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

	@GetMapping ("/entries/{id}")
	public Resource<Entry> getEntry(@PathVariable final Long id,
	                                @RequestAttribute final TimesheetAuthManager authMan) {
		final Entry entry = this.entryService.getEntry(id);

		//if (1==1) throw new IndexOutOfBoundsException();

		return this.assembler.toResource(new TimesheetAuthLinkWrapper<>(entry, authMan));
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
	public ResponseEntity<?> createEntry(@RequestBody final Entry newEntry,
	                                     @RequestAttribute final TimesheetAuthManager authMan) throws URISyntaxException {
		final Resource<Entry> resource = this.assembler.toResource(new TimesheetAuthLinkWrapper<>(this.entryService.saveEntry(newEntry), authMan));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	@PutMapping ("/entries/{id}")
	public ResponseEntity<?> updateEntry(@PathVariable final Long id,
	                                     @RequestBody final Entry newEntry,
	                                     @RequestAttribute final TimesheetAuthManager authMan) throws URISyntaxException {
		final Entry updatedEntry = this.entryService.updateEntry(id, newEntry);
		final Resource<Entry> resource = this.assembler.toResource(new TimesheetAuthLinkWrapper<>(updatedEntry, authMan));
		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	@DeleteMapping ("/entries/{id}")
	public ResponseEntity<?> deleteEntry(@PathVariable final Long id) {
		this.entryService.deleteEntry(id);

		return ResponseEntity.noContent().build();
	}

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

	@PostMapping ("/entries/{id}/copy")
	public ResponseEntity<?> copyEntry(@PathVariable final Long id,
	                                   @RequestAttribute final TimesheetAuthManager authMan) throws URISyntaxException {
		final Resource<Entry> resource = this.assembler.toResource(new TimesheetAuthLinkWrapper<>(this.entryService.copyEntry(id), authMan));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	@ExceptionHandler ({EntryNotFoundException.class, IllegalEntryStateException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Entry Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}