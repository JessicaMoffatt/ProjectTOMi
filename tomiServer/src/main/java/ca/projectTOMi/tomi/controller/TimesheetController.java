package ca.projectTOMi.tomi.controller;

import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.TimesheetResourceAssembler;
import ca.projectTOMi.tomi.exception.IllegalTimesheetModificationException;
import ca.projectTOMi.tomi.exception.TimesheetNotFoundException;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.service.EntryService;
import ca.projectTOMi.tomi.service.UserAccountService;
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
 * @author Karol Talbot
 * @version 1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class TimesheetController {
	private final TimesheetResourceAssembler assembler;
	private final EntryService entryService;
	private final UserAccountService userAccountService;
	private final Logger logger = LoggerFactory.getLogger("Timesheet Controller");

	@Autowired
	public TimesheetController(final TimesheetResourceAssembler assembler, final EntryService entryService, final UserAccountService userAccountService) {
		this.assembler = assembler;
		this.entryService = entryService;
		this.userAccountService = userAccountService;
	}

	@GetMapping ("/timesheets/{id}")
	public Resource<Timesheet> getTimesheet(@PathVariable final Long id) {
		return this.assembler.toResource(this.entryService.getTimesheetById(id));
	}

	@PutMapping ("/timesheets/{id}/submit")
	public Resource<Timesheet> submitTimesheet(@PathVariable final Long id) {
		return this.assembler.toResource(this.entryService.submitTimesheet(id));
	}

	@GetMapping ("/timesheets/user_accounts/{userAccountId}")
	public Resources<Resource<Timesheet>> getTimesheetsByUserAccount(@PathVariable final Long userAccountId) {
		final List<Resource<Timesheet>> expense = this.userAccountService.getTimesheetsByUserAccount(userAccountId)
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(expense,
			linkTo(methodOn(TimesheetController.class).getTimesheetsByUserAccount(userAccountId)).withSelfRel());
	}

	@ExceptionHandler ({IllegalTimesheetModificationException.class, TimesheetNotFoundException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Timesheet Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}
