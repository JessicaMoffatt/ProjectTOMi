package ca.projectTOMi.tomi.controller;

import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.TimesheetResourceAssembler;
import ca.projectTOMi.tomi.exception.IllegalTimesheetModificationException;
import ca.projectTOMi.tomi.exception.TimesheetNotFoundException;
import ca.projectTOMi.tomi.model.Timesheet;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 *
 * @author Karol Talbot
 * @version 1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class TimesheetController {
  private final TimesheetResourceAssembler assembler;
  private final TimesheetService service;
  private final Logger logger = LoggerFactory.getLogger("Timesheet Controller");

  @Autowired
  public TimesheetController(TimesheetResourceAssembler assembler, TimesheetService service) {
    this.assembler = assembler;
    this.service = service;
  }

  @GetMapping("/timesheets")
  public Resources<Resource<Timesheet>> getActiveTimesheets(){
    List<Resource<Timesheet>> expense = service.getActiveTimesheets().stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(expense,
      linkTo(methodOn(TimesheetController.class).getActiveTimesheets()).withSelfRel());
  }

  @GetMapping("/timesheets/{id}")
  public Resource<Timesheet> getTimesheet(@PathVariable  Long id){
    return assembler.toResource(service.getTimesheetById(id));
  }

  @PutMapping("/timesheets/{id}")
  public Resource<Timesheet> updateTimesheet(@PathVariable Long id, @RequestBody Timesheet timesheet){
    return assembler.toResource(service.updateTimesheet(id, timesheet));
  }

  @PutMapping("/timesheets/{id}/submit")
  public Resource<Timesheet> submitTimesheet(@PathVariable Long id){
    return assembler.toResource(service.submitTimesheet(id));
  }

  @DeleteMapping("/timesheets/{id}")
  public ResponseEntity<?> setTimesheetInactive(@PathVariable Long id) {

    return ResponseEntity.noContent().build();
  }

  @GetMapping("/timesheetEvalTest/{id}")
  public void evalTimesheet(@PathVariable Long id){
    service.evaluateTimesheet(id);
  }

  @GetMapping("/timesheets/userAccount/{id}")
  public Resources<Resource<Timesheet>> getTimesheetsByUserAccount(@PathVariable Long id){
    List<Resource<Timesheet>> expense = service.getTimesheetsByUserAccount(id).stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(expense,
      linkTo(methodOn(TimesheetController.class).getTimesheetsByUserAccount(id)).withSelfRel());
  }

  @ExceptionHandler({IllegalTimesheetModificationException.class, TimesheetNotFoundException.class})
  public ResponseEntity<?> handleExceptions(Exception e){
    logger.warn("Timesheet Exception: " + e.getClass());
    return ResponseEntity.status(400).build();
  }
}
