package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.authorization.wrapper.TimesheetAuthLinkWrapper;
import ca.projectTOMi.tomi.controller.EntryController;
import ca.projectTOMi.tomi.controller.TimesheetController;
import ca.projectTOMi.tomi.model.Timesheet;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * TimesheetResourceAssembler is responsible for creating a standard resource for {@link Timesheet}
 * objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Component
public final class TimesheetResourceAssembler implements ResourceAssembler<TimesheetAuthLinkWrapper<Timesheet>, Resource<Timesheet>> {

	@Override
	public Resource<Timesheet> toResource(final TimesheetAuthLinkWrapper<Timesheet> timesheetAuthLinkWrapper) {
		final Timesheet timesheet = timesheetAuthLinkWrapper.getModelObject();
		final Resource<Timesheet> resource = new Resource<>(timesheet,
			linkTo(methodOn(TimesheetController.class).getTimesheet(timesheet.getId(), timesheetAuthLinkWrapper.getManager())).withSelfRel(),
			linkTo(methodOn(EntryController.class).getAllTimesheetEntries(timesheet.getId(), timesheetAuthLinkWrapper.getManager())).withRel("getEntries"),
			linkTo(methodOn(TimesheetController.class).getTimesheetsByUserAccount(timesheet.getUserAccount().getId(), timesheetAuthLinkWrapper.getManager())).withRel("timesheets")
		);

		final Link submitLink = linkTo(methodOn(TimesheetController.class).submitTimesheet(timesheet.getId(), timesheetAuthLinkWrapper.getManager())).withRel("submit");
		if (timesheetAuthLinkWrapper.getManager().requestAuthorization(submitLink.getHref(), "PUT")) {
			resource.add(submitLink);
		}
		return resource;
	}
}
