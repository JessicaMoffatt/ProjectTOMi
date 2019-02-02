package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.exception.ExpenseNotFoundException;
import ca.projectTOMi.tomi.model.Expense;
import ca.projectTOMi.tomi.persistence.ExpenseRepository;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link Expense} objects.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Service
public final class ExpenseService {
  private ExpenseRepository repository;

  /**
   * Constructor for the {@link Expense} Service.
   *
   * @param repository
   *   Repository responsible for persisting Expense instances
   */
  public ExpenseService(ExpenseRepository repository) {
    this.repository = repository;
  }

  /**
   * Gets a list of all {@link Expense} that are active.
   *
   * @return List containing all Expense that are active
   */
  public List<Expense> getActiveExpenses() {
    return repository.getAllByActive(true);
  }

  /**
   * Gets a {@link Expense} object with the provided id.
   *
   * @param id
   *   the unique identifier for the Expense to be found
   *
   * @return Expense object matching the provided id
   */
  public Expense getExpenseById(Long id) {
    return this.repository.findById(id).orElseThrow(() -> new ExpenseNotFoundException());
  }

  /**
   * Persists the provided {@link Expense}.
   *
   * @param expense
   *   Expense to be persisted
   *
   * @return the Expense that was persisted
   */
  public Expense saveExpense(Expense expense) {
    return repository.save(expense);
  }

  /**
   * Updates the {@link Expense} with the provided id with the provided attributes.
   *
   * @param id
   *   the unique identifier for the expense to be updated
   * @param newExpense
   *   Expense object containing the updated attributes
   *
   * @return Expense containing the updated attributes
   */
  public Expense updateExpense(Long id, Expense newExpense) {
    return repository.findById(id).map(expense -> {
      expense.setNotes(newExpense.getNotes());
      expense.setProject(newExpense.getProject());
      expense.setAmount(newExpense.getAmount());
      expense.setActive(newExpense.isActive());
      return repository.save(expense);
    }).orElseThrow(() -> new ExpenseNotFoundException());
  }
}
