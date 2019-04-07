package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.authorization.wrapper.TimesheetAuthLinkWrapper;
import ca.projectTOMi.tomi.controller.EntryController;
import ca.projectTOMi.tomi.controller.ProjectController;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;
import java.net.URISyntaxException;

/**
 * EntryResourceAssembler is responsible for creating a standard resource for {@link Entry}.
 *
 * @author Iliya Kiritchkov
 * @author Karol Talbot
 * @version 1.2
 */
@Component
public class EntryResourceAssembler implements ResourceAssembler<TimesheetAuthLinkWrapper<Entry>, Resource<Entry>> {
	/**
	 * Provides access to the logs for error reporting.
	 */
	private final Logger logger = LoggerFactory.getLogger("Entry Assembler");

	/**
	 * Converts a Entry instance into a Resource instance with HATEOAS links based on the requesting
	 * user's {@link ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy}s.
	 *
	 * @param timesheetAuthLinkWrapper
	 * 	a {@link ca.projectTOMi.tomi.model.Entry} object paired with the {@link
	 * 	ca.projectTOMi.tomi.authorization.manager.AuthManager} created for the request
	 *
	 * @return Resource of the provided Entry
	 */
	@Override
	public Resource<Entry> toResource(final TimesheetAuthLinkWrapper<Entry> timesheetAuthLinkWrapper) {
		final Entry entry = timesheetAuthLinkWrapper.getModelObject();
		final Resource<Entry> resource = new Resource<>(entry,
			linkTo(methodOn(EntryController.class).getEntry(entry.getId(), timesheetAuthLinkWrapper.getManager())).withSelfRel(),
			linkTo(methodOn(EntryController.class).getAllTimesheetEntries(entry.getTimesheet().getId(), timesheetAuthLinkWrapper.getManager())).withRel("entries")
		);

		if (Status.SUBMITTED == entry.getStatus()) {
			resource.add(linkTo(methodOn(ProjectController.class).evaluateEntry(entry.getProject() != null ? entry.getProject().getId() : null, entry.getId(), null)).withRel("evaluate"));
		}

		try {
			final Link updateLink = linkTo(methodOn(EntryController.class).updateEntry(entry.getId(), entry, timesheetAuthLinkWrapper.getManager())).withRel("update");
			if (timesheetAuthLinkWrapper.getManager() != null) {
				if (timesheetAuthLinkWrapper.getManager().requestAuthorization(updateLink.getHref(), "PUT")) {
					resource.add(updateLink);
					resource.add(linkTo(methodOn(EntryController.class).copyEntry(entry.getId(), timesheetAuthLinkWrapper.getManager())).withRel("copy"));
				}
				final Link deleteLink = linkTo(methodOn(EntryController.class).deleteEntry(entry.getId())).withRel("delete");
				if (timesheetAuthLinkWrapper.getManager().requestAuthorization(deleteLink.getHref(), "DELETE")) {
					resource.add(deleteLink);
				}
			}
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}
