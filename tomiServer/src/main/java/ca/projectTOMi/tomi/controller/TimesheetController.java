package ca.projectTOMi.tomi.controller;

import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.TimesheetResourceAssembler;
import ca.projectTOMi.tomi.authorization.manager.TimesheetAuthManager;
import ca.projectTOMi.tomi.authorization.wrapper.TimesheetAuthLinkWrapper;
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
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Rest Controller that handles HTTP requests for {@link Timesheet} objects in the TOMi system.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class TimesheetController {
	/**
	 * Converts Timesheets into HATEOAS Resources.
	 */
	private final TimesheetResourceAssembler assembler;

	/**
	 * Provides services for Timesheets and Entry objects.
	 */
	private final EntryService entryService;

	/**
	 * Provides services for UserAccounts.
	 */
	private final UserAccountService userAccountService;

	/**
	 * Provides access to the system logs for error reporting.
	 */
	private final Logger logger = LoggerFactory.getLogger("Timesheet Controller");

	/**
	 * Creates the TimesheetController.
	 *
	 * @param assembler
	 * 	Converts Timesheets into Resources.
	 * @param entryService
	 * 	Provides services for Entry and Timesheet objects
	 * @param userAccountService
	 * 	Provides services for UserAccounts
	 */
	@Autowired
	public TimesheetController(final TimesheetResourceAssembler assembler, final EntryService entryService, final UserAccountService userAccountService) {
		this.assembler = assembler;
		this.entryService = entryService;
		this.userAccountService = userAccountService;
	}

	/**
	 * Gets the Timesheet with the provided id.
	 *
	 * @param id
	 * 	The unique identifier for the timesheet
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Timesheet with the provided id
	 */
	@GetMapping ("/timesheets/{id}")
	public Resource<Timesheet> getTimesheet(@PathVariable final Long id,
	                                        @RequestAttribute final TimesheetAuthManager authMan) {
		return this.assembler.toResource(new TimesheetAuthLinkWrapper<>(this.entryService.getTimesheetById(id), authMan));
	}

	/**
	 * Requests submission of a Timesheet.
	 *
	 * @param id
	 * 	The unique identifier for the Timesheet.
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Resource representing the submitted Timesheet
	 */
	@PutMapping ("/timesheets/{id}/submit")
	public Resource<Timesheet> submitTimesheet(@PathVariable final Long id,
	                                           @RequestAttribute final TimesheetAuthManager authMan) {
		return this.assembler.toResource(new TimesheetAuthLinkWrapper<>(this.entryService.submitTimesheet(id), authMan));
	}

	/**
	 * Gets all timesheets for the provided UserAccount.
	 *
	 * @param userAccountId
	 * 	The unique identifier for the UserAccount
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return List of Resources representing the timesheets for the identified UserAccount
	 */
	@GetMapping ("/timesheets/user_accounts/{userAccountId}")
	public Resources<Resource<Timesheet>> getTimesheetsByUserAccount(@PathVariable final Long userAccountId,
	                                                                 @RequestAttribute final TimesheetAuthManager authMan) {
		final List<Resource<Timesheet>> timesheetList = this.userAccountService.getTimesheetsByUserAccount(userAccountId)
			.stream()
			.map(timesheet -> (new TimesheetAuthLinkWrapper<>(timesheet, authMan)))
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(timesheetList,
			linkTo(methodOn(TimesheetController.class).getTimesheetsByUserAccount(userAccountId, authMan)).withSelfRel());
	}

	/**
	 * Informs the client that an exception has occurred. In order to keep the server inner workings
	 * private a generic 400 bad request is used.
	 *
	 * @param e
	 * 	The exception that had occurred
	 *
	 * @return A 400 Bad Request Response
	 */
	@ExceptionHandler ({IllegalTimesheetModificationException.class, TimesheetNotFoundException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Timesheet Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}
