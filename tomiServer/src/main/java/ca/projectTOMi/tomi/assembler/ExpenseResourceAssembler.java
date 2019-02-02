package ca.projectTOMi.tomi.assembler;

import java.net.URISyntaxException;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.controller.ExpenseController;
import ca.projectTOMi.tomi.model.Expense;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * ExpenseResourceAssembler is responsible for creating a standard resource for {@link Expense}
 * objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Component
public final class ExpenseResourceAssembler implements ResourceAssembler<Expense, Resource<Expense>> {
  @Override
  public Resource<Expense> toResource(Expense expense) {
    Resource<Expense> resource = new Resource<>(expense,
      linkTo(methodOn(ExpenseController.class).getExpense(expense.getId())).withSelfRel(),
      linkTo(methodOn(ExpenseController.class).getActiveExpenses()).withRel("expenses"),
      linkTo(methodOn(ExpenseController.class).setExpenseInactive(expense.getId())).withRel("delete"));

    try {
      resource.add(linkTo(methodOn(ExpenseController.class).updateExpense(expense.getId(), expense)).withRel("update"));
    } catch (URISyntaxException e) {
      System.out.println(e);
    }
    return resource;
  }
}
