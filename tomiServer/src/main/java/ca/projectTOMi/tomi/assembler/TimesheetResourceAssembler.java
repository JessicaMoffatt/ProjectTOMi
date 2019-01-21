package ca.projectTOMi.tomi.assembler;

import ca.projectTOMi.tomi.model.Timesheet;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

@Component
public class TimesheetResourceAssembler implements ResourceAssembler<Timesheet, Resource<Timesheet>> {

  public Resource<Timesheet> toResource(Timesheet timesheet){
    return new Resource<>(timesheet);
  }
}
