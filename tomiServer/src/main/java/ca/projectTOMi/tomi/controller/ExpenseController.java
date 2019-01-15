package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.assembler.ExpenseResourceAssembler;
import ca.projectTOMi.tomi.model.Expense;
import ca.projectTOMi.tomi.service.ExpenseService;
import org.springframework.hateoas.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Karol Talbot
 * @version 1
 */
@RestController
public class ExpenseController {
  ExpenseService service;
  ExpenseResourceAssembler assembler;

  public ExpenseController(ExpenseResourceAssembler assembler, ExpenseService service){
    this.assembler = assembler;
    this.service = service;
  }

  @GetMapping("/expenses/{id}")
  public Resource<Expense> getExpense(@PathVariable Long id){
    return assembler.toResource(service.getExpenseById(id));
  }

}
