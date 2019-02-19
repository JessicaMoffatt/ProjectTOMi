package ca.projectTOMi.tomi.assembler;

import ca.projectTOMi.tomi.controller.EntryController;
import ca.projectTOMi.tomi.model.Entry;
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
		final Resource<Entry> resource = new Resource<>(entry,
			linkTo(methodOn(EntryController.class).getEntry(entry.getId())).withSelfRel(),
			linkTo(methodOn(EntryController.class).getActiveEntries()).withRel("entries"),
			linkTo(methodOn(EntryController.class).deleteEntry(entry.getId())).withRel("delete")
		);

		try {
			resource.add(linkTo(methodOn(EntryController.class).updateEntry(entry.getId(), entry)).withRel("update"));
			resource.add(linkTo(methodOn(EntryController.class).copyEntry(entry.getId())).withRel("copy"));
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}
