package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.model.Expense;
import ca.projectTOMi.tomi.persistence.ExpenseRepository;
import org.springframework.stereotype.Service;

@Service
public class ExpenseService {
  ExpenseRepository repository;

  public ExpenseService(ExpenseRepository repository){
    this.repository = repository;
  }

  public Expense getExpenseById(Long id){
    return repository.getOne(id);
  }
}
