package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.controller.EntryController;
import ca.projectTOMi.tomi.controller.TimesheetController;
import ca.projectTOMi.tomi.model.Timesheet;
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
public final class TimesheetResourceAssembler implements ResourceAssembler<Timesheet, Resource<Timesheet>> {

	@Override
	public Resource<Timesheet> toResource(final Timesheet timesheet) {
		return new Resource<>(timesheet,
			linkTo(methodOn(TimesheetController.class).getTimesheet(timesheet.getId(), timesheet.getUserAccount().getId())).withSelfRel(),
			linkTo(methodOn(TimesheetController.class).submitTimesheet(timesheet.getId(), timesheet.getUserAccount().getId())).withRel("submit"),
			linkTo(methodOn(EntryController.class).getAllTimesheetEntries(timesheet.getId(), timesheet.getUserAccount().getId())).withRel("getEntries"),
			linkTo(methodOn(TimesheetController.class).getTimesheetsByUserAccount(timesheet.getUserAccount().getId())).withRel("timesheets")
		);
	}
}
