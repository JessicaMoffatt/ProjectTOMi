package ca.projectTOMi.tomi.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.ExpenseResourceAssembler;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Handles HTTP requests for {@link Expense} objects in the ProjectTOMi system.
 *
 * @author Karol Talbot
 * @version 1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class ExpenseController {
	private final ExpenseService expenseService;
	private final ExpenseResourceAssembler assembler;
	private final Logger logger = LoggerFactory.getLogger("Expense Controller");

	@Autowired
	public ExpenseController(final ExpenseService expenseService, final ExpenseResourceAssembler assembler) {
		this.expenseService = expenseService;
		this.assembler = assembler;
	}


	@GetMapping ("/projects/{projectId}/expenses/{expenseId}")
	public Resource<Expense> getExpense(@PathVariable final Long expenseId, @PathVariable final String projectId) {
		return this.assembler.toResource(this.expenseService.getExpenseById(expenseId));
	}

	/**
	 * Returns a collection of all active {@link Expense} the source of a GET request to /expenses.
	 *
	 * @return Collection of resources representing all active Expenses
	 */
	@GetMapping ("/projects/{projectId}/expenses")
	public Resources<Resource<Expense>> getActiveExpenses(@PathVariable final String projectId) {
		final List<Resource<Expense>> expense = this.expenseService.getActiveExpensesByProject(projectId)
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(expense,
			linkTo(methodOn(ExpenseController.class).getActiveExpenses(projectId)).withSelfRel());
	}

	/**
	 * Creates a new {@link Expense} with the attributes provided in the POST request to /expenses.
	 *
	 * @param newExpense
	 * 	an Expense object with required information.
	 *
	 * @return response containing links to the newly created Expense
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed
	 */
	@PostMapping ("/projects/{projectId}/expenses")
	public ResponseEntity<?> createExpense(@RequestBody final Expense newExpense, @PathVariable final String projectId) throws URISyntaxException {
		newExpense.setActive(true);
		Project p = new Project();
		p.setId(projectId);
		newExpense.setProject(p);
		final Resource<Expense> resource = this.assembler.toResource(this.expenseService.saveExpense(newExpense));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	@PutMapping ("/projects/{projectId}/expenses/{expenseId}")
	public ResponseEntity<?> updateExpense(@PathVariable final Long expenseId, @PathVariable final String projectId, @RequestBody final Expense newExpense) throws URISyntaxException {
		final Expense updatedExpense = this.expenseService.updateExpense(expenseId, newExpense);
		final Resource<Expense> resource = this.assembler.toResource(updatedExpense);

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	@DeleteMapping ("/projects/{projectId}/expenses/{expenseId}")
	public ResponseEntity<?> setExpenseInactive(@PathVariable final Long expenseId, @PathVariable final String projectId) {
		final Expense expense = this.expenseService.getExpenseById(expenseId);
		expense.setActive(false);
		this.expenseService.saveExpense(expense);

		return ResponseEntity.noContent().build();
	}

	@ExceptionHandler ({ExpenseNotFoundException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Expense Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}
