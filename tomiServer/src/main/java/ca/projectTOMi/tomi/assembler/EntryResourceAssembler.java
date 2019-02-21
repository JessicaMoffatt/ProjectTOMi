package ca.projectTOMi.tomi.assembler;

import ca.projectTOMi.tomi.controller.EntryController;
import ca.projectTOMi.tomi.controller.ProjectController;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * EntryResourceAssembler is responsible for creating a standard resource for {@link Entry}.
 *
 * @author Iliya Kiritchkov and Karol Talbot
 * @version 1.2
 */
@Component
public class EntryResourceAssembler implements ResourceAssembler<Entry, Resource<Entry>> {
	private final Logger logger = LoggerFactory.getLogger("Entry Assembler");

	@Override
	public Resource<Entry> toResource(final Entry entry) {
		final Long userAccountId = entry.getTimesheet().getUserAccount().getId();
		final Resource<Entry> resource = new Resource<>(entry,
			linkTo(methodOn(EntryController.class).getEntry(entry.getId(), userAccountId)).withSelfRel(),
			linkTo(methodOn(EntryController.class).getAllTimesheetEntries(entry.getTimesheet().getId(), userAccountId)).withRel("entries"),
			linkTo(methodOn(EntryController.class).deleteEntry(entry.getId(), userAccountId)).withRel("delete")
		);

		if(entry.getStatus() == Status.SUBMITTED){
			linkTo(methodOn(ProjectController.class).evaluateEntry(entry.getProject() == null ? entry.getProject().getId() : null, entry.getId(), null)).withRel("evaluate");
		}

		try {
			resource.add(linkTo(methodOn(EntryController.class).updateEntry(entry.getId(), userAccountId, entry)).withRel("update"));
			resource.add(linkTo(methodOn(EntryController.class).copyEntry(entry.getId(), userAccountId)).withRel("copy"));
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}
