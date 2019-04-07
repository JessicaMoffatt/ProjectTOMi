package ca.projectTOMi.tomi.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.ExpenseResourceAssembler;
import ca.projectTOMi.tomi.authorization.manager.ProjectAuthManager;
import ca.projectTOMi.tomi.authorization.wrapper.ProjectAuthLinkWrapper;
import ca.projectTOMi.tomi.exception.ExpenseNotFoundException;
import ca.projectTOMi.tomi.model.Expense;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.service.ExpenseService;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Rest Controller that handles HTTP requests for {@link Expense} objects in the TOMi system.
 *
 * @author Karol Talbot
 * @version 1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class ExpenseController {
	/**
	 * Provides services for maintaining expenses in the system.
	 */
	private final ExpenseService expenseService;

	/**
	 * Converts Expense model objects into HATEOAS Resources.
	 */
	private final ExpenseResourceAssembler assembler;

	/**
	 * Provides access to the system logs for error reporting purposes.
	 */
	private final Logger logger = LoggerFactory.getLogger("Expense Controller");

	/**
	 * Creates the ExpenseController.
	 *
	 * @param expenseService
	 * 	Provides services for maintaining Expenses
	 * @param assembler
	 * 	Converts Expenses to Resources
	 */
	@Autowired
	public ExpenseController(final ExpenseService expenseService, final ExpenseResourceAssembler assembler) {
		this.expenseService = expenseService;
		this.assembler = assembler;
	}

	/**
	 * Gets a requested expense for a requested project.
	 *
	 * @param expenseId
	 * 	The unique identifier for the requested expense
	 * @param projectId
	 * 	The unique identifier for the requested project
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Resource representing the requested expense
	 */
	@GetMapping ("/projects/{projectId}/expenses/{expenseId}")
	public Resource<Expense> getExpense(@PathVariable final Long expenseId,
	                                    @PathVariable final String projectId,
	                                    @RequestAttribute final ProjectAuthManager authMan) {
		//is this even used?? if(1==1) throw new IndexOutOfBoundsException();

		return this.assembler.toResource(new ProjectAuthLinkWrapper<>(this.expenseService.getExpenseById(expenseId), authMan));
	}

	/**
	 * Returns a collection of all active {@link Expense} for a requested project
	 *
	 * @param projectId
	 * 	The unique identifier for the project
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Collection of resources representing all active Expenses for the requested Project
	 */
	@GetMapping ("/projects/{projectId}/expenses")
	public Resources<Resource<Expense>> getActiveExpenses(@PathVariable final String projectId,
	                                                      @RequestAttribute final ProjectAuthManager authMan) {
		final List<Resource<Expense>> expenseList = this.expenseService.getActiveExpensesByProject(projectId)
			.stream()
			.map(expense -> (new ProjectAuthLinkWrapper<>(expense, authMan)))
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		// works! if(1==1) throw new IndexOutOfBoundsException();

		return new Resources<>(expenseList,
			linkTo(methodOn(ExpenseController.class).getActiveExpenses(projectId, authMan)).withSelfRel());
	}

	/**
	 * Creates a new {@link Expense} with the attributes provided in the POST request for a requested
	 * Project.
	 *
	 * @param newExpense
	 * 	An Expense object with required information.
	 * @param projectId
	 * 	The unique identifier for the requested Project
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return response containing links to the newly created Expense
	 *
	 * @throws URISyntaxException
	 * 	When the created URI is unable to be parsed
	 */
	@PostMapping ("/projects/{projectId}/expenses")
	public ResponseEntity<?> createExpense(@RequestBody final Expense newExpense,
	                                       @PathVariable final String projectId,
	                                       @RequestAttribute final ProjectAuthManager authMan) throws URISyntaxException {
		newExpense.setActive(true);
		final Project p = new Project();
		p.setId(projectId);
		newExpense.setProject(p);
		final Resource<Expense> resource = this.assembler.toResource(new ProjectAuthLinkWrapper<>(this.expenseService.saveExpense(newExpense), authMan));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Updates a requested Expense for a specific Project.
	 *
	 * @param expenseId
	 * 	The unique identifier for the Expense
	 * @param projectId
	 * 	The unique identifier for the Project
	 * @param newExpense
	 * 	The Expense created from the body of the PUT request
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Resource representing the updated Expense
	 *
	 * @throws URISyntaxException
	 * 	When the created URI is unable to be parsed
	 */
	@PutMapping ("/projects/{projectId}/expenses/{expenseId}")
	public ResponseEntity<?> updateExpense(@PathVariable final Long expenseId,
	                                       @PathVariable final String projectId,
	                                       @RequestBody final Expense newExpense,
	                                       @RequestAttribute final ProjectAuthManager authMan) throws URISyntaxException {
		final Expense updatedExpense = this.expenseService.updateExpense(expenseId, newExpense);
		final Resource<Expense> resource = this.assembler.toResource(new ProjectAuthLinkWrapper<>(updatedExpense, authMan));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Deletes the provided Expense for the provided Project.
	 *
	 * @param expenseId
	 * 	The unique identifier for the Expense
	 * @param projectId
	 * 	The unique identifier for the Project
	 *
	 * @return Empty HTTP response to inform the client of success
	 */
	@DeleteMapping ("/projects/{projectId}/expenses/{expenseId}")
	public ResponseEntity<?> setExpenseInactive(@PathVariable final Long expenseId,
	                                            @PathVariable final String projectId) {
		final Expense expense = this.expenseService.getExpenseById(expenseId);
		expense.setActive(false);
		this.expenseService.saveExpense(expense);

		return ResponseEntity.noContent().build();
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
	@ExceptionHandler ({ExpenseNotFoundException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Expense Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}
