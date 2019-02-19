package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.assembler.EntryResourceAssembler;
import ca.projectTOMi.tomi.exception.EntryNotFoundException;
import ca.projectTOMi.tomi.exception.IllegalEntryStateException;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.service.EntryService;
import ca.projectTOMi.tomi.service.TimesheetService;
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
 * Handles HTTP requests for {@Link Entry} objects in the ProjectTOMi system.
 *
 * @author Iliya Kiritchkov
 * @version 1.1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class EntryController {
    private final EntryResourceAssembler assembler;
    private final EntryService service;
    private final TimesheetService timesheetService;
    private Logger logger = LoggerFactory.getLogger("Entry Controller");

    @Autowired
    public EntryController(EntryResourceAssembler assembler, EntryService service, TimesheetService timesheetService) {
        this.assembler = assembler;
        this.service = service;
        this.timesheetService = timesheetService;
    }

    /**
     * Returns a resource representing the requested {@Link Entry} to the source of a GET request to /entries/id.
     *
     * @param id unique identifier for the Entry.
     * @return Resource representing the Entry object.
     */
    @GetMapping("/entries/{id}")
    public Resource<Entry> getEntry(@PathVariable Long id) {
        Entry entry = service.getEntry(id);

        return assembler.toResource(entry);
    }

    /**
     * Returns a collectin of all active {@Link Entry} objects to the source of a GET request to /entries.
     *
     * @return Collection of resources representing all active Entries.
     */
    @GetMapping("/entries")
    public Resources<Resource<Entry>> getActiveEntries() {
        List<Resource<Entry>> entry = service.getActiveEntries().stream().map(assembler::toResource).collect(Collectors.toList());

        return new Resources<>(entry,
                linkTo(methodOn(EntryController.class).getActiveEntries()).withSelfRel());
    }

    /**
     * Creates a new {@Link Entry} with the attributes provided in the POST request to /entries.
     *
     * @param newEntry an Entry object with required information.
     * @return response containing links to the newly created Entry.
     * @throws URISyntaxException when the created URI is unable to be parsed.
     */
    @PostMapping("/entries")
    public ResponseEntity<?> createEntry(@RequestBody Entry newEntry) throws URISyntaxException {
        Resource<Entry> resource = assembler.toResource(service.saveEntry(newEntry));

        return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
    }

    /**
     * Updates the attributes for a {@Link Entry} with the provided id with the attributes provided in the PUT request to /entries/id.
     *
     * @param id       the unique identifier for the Entry to update.
     * @param newEntry the updated Entry.
     * @return response containing a link to the updated Entry.
     * @throws URISyntaxException when the created URI is unable to be parsed.
     */
    @PutMapping("/entries/{id}")
    public ResponseEntity<?> updateEntry(@PathVariable Long id, @RequestBody Entry newEntry) throws URISyntaxException {
        Entry updatedEntry = service.updateEntry(id, newEntry);
        Resource<Entry> resource = assembler.toResource(updatedEntry);
        return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
    }

    /**
     * Deletes the {@Link Entry} with the provided id. The EntryService determines how to properly delete the Entry object.
     * Responds to the DELETE requests to /entries/id.
     *
     * @param id the unique identifier for the Entry to be deleted or set inactive.
     * @return a response without any content.
     */
    @DeleteMapping("/entries/{id}")
    public ResponseEntity<?> deleteEntry(@PathVariable Long id) {
        service.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/timesheets/{id}/entries")
    public Resources<Resource<Entry>> getAllTimesheetEntries(@PathVariable Long id){
        List<Resource<Entry>> entry = timesheetService.getEntriesByTimesheet(id).stream().map(assembler::toResource).collect(Collectors.toList());

        return new Resources<>(entry,
          linkTo(methodOn(EntryController.class).getActiveEntries()).withSelfRel());
    }

    @PostMapping("/entries/{id}/copy")
    public ResponseEntity<?> copyEntry(@PathVariable Long id) throws URISyntaxException {
        Resource<Entry> resource = assembler.toResource(service.copyEntry(id));

        return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
    }

    @ExceptionHandler({EntryNotFoundException.class, IllegalEntryStateException.class})
    public ResponseEntity<?> handleExceptions(Exception e){
        logger.warn("Entry Exception: " + e.getClass());
        return ResponseEntity.status(400).build();
    }
}