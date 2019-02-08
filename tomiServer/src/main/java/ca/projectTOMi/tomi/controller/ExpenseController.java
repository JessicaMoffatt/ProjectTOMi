package ca.projectTOMi.tomi.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.ExpenseResourceAssembler;
import ca.projectTOMi.tomi.exception.ExpenseNotFoundException;
import ca.projectTOMi.tomi.model.Expense;
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
  private final ExpenseService service;
  private final ExpenseResourceAssembler assembler;
  private final Logger logger = LoggerFactory.getLogger("Expense Controller");

  @Autowired
  public ExpenseController(ExpenseService service, ExpenseResourceAssembler assembler){
    this.service = service;
    this.assembler = assembler;
  }

  /**
   * Returns a resource representing the requested {@link Expense} to the source of a GET request to
   * /expenses/id.
   *
   * @param id
   *   unique identifier for the Expense
   *
   * @return Resource representing the Expense object.
   */
  @GetMapping ("/expenses/{id}")
  public Resource<Expense> getExpense(@PathVariable Long id) {
    return assembler.toResource(service.getExpenseById(id));
  }

  /**
   * Returns a collection of all active {@link Expense} the source of a GET request to /expenses.
   *
   * @return Collection of resources representing all active Expenses
   */
  @GetMapping ("/expenses")
  public Resources<Resource<Expense>> getActiveExpenses() {

    List<Resource<Expense>> expense = service.getActiveExpenses().stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(expense,
      linkTo(methodOn(ExpenseController.class).getActiveExpenses()).withSelfRel());
  }

  /**
   * Creates a new {@link Expense} with the attributes provided in the POST request to /expenses.
   *
   * @param newExpense
   *   an Expense object with required information.
   *
   * @return response containing links to the newly created Expense
   *
   * @throws URISyntaxException
   *   when the created URI is unable to be parsed
   */
  @PostMapping ("/expenses")
  public ResponseEntity<?> createExpense(@RequestBody Expense newExpense) throws URISyntaxException {
    Resource<Expense> resource = assembler.toResource(service.saveExpense(newExpense));

    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  /**
   * Updates the attributes for a {@link Expense} with the provided id with the attributes provided
   * in the PUT request to /expenses/id.
   *
   * @param id
   *   the unique identifier for the Expense to be updated
   * @param newExpense
   *   the updated Expense
   *
   * @return response containing a link to the updated Expense
   *
   * @throws URISyntaxException
   *   when the created URI is unable to be parsed
   */
  @PutMapping ("/expenses/{id}")
  public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody Expense newExpense) throws URISyntaxException {
    Expense updatedExpense = service.updateExpense(id, newExpense);
    Resource<Expense> resource = assembler.toResource(updatedExpense);
    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  /**
   * Sets the requested {@link Expense}'s active attribute false, removing it from the list of
   * active Expenses. Responds to the DELETE requests to /expenses/id.
   *
   * @param id
   *   the unique identifier for the Expense to be set inactive
   *
   * @return a response without any content
   */
  @DeleteMapping ("/expenses/{id}")
  public ResponseEntity<?> setExpenseInactive(@PathVariable Long id) {
    Expense expense = service.getExpenseById(id);
    expense.setActive(false);
    service.saveExpense(expense);

    return ResponseEntity.noContent().build();
  }

  @ExceptionHandler({ExpenseNotFoundException.class})
  public ResponseEntity<?> handleExceptions(Exception e){
    logger.warn("Expense Exception: " + e.getClass());
    return ResponseEntity.status(400).build();
  }
}
