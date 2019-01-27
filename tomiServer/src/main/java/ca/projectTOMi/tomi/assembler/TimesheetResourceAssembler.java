package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

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

  public Resource<Timesheet> toResource(Timesheet timesheet){
    return new Resource<>(timesheet,
      linkTo(methodOn(TimesheetController.class).getTimesheet(timesheet.getId())).withSelfRel(),
      linkTo(methodOn(TimesheetController.class).getActiveTimesheets()).withRel("timesheets"),
      linkTo(methodOn(TimesheetController.class).updateTimesheet(timesheet.getId(), timesheet)).withRel("update"),
      linkTo(methodOn(TimesheetController.class).setTimesheetInactive(timesheet.getId())).withRel("delete"),
      linkTo(methodOn(TimesheetController.class).submitTimesheet(timesheet.getId())).withRel("submit")
    );
  }
}
