package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.controller.ExpenseController;
import ca.projectTOMi.tomi.model.Expense;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 *
 * @author Karol Talbot
 * @version 1
 */
@Component
public class ExpenseResourceAssembler implements ResourceAssembler<Expense, Resource<Expense>> {
  @Override
  public Resource<Expense> toResource(Expense expense){
    Resource<Expense> resource = new Resource<>(expense,
      linkTo(methodOn(ExpenseController.class).getExpense(expense.getId())).withSelfRel());

    return resource;
  }
}
