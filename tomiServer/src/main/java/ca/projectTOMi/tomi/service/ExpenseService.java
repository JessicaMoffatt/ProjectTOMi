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
	private final ExpenseRepository repository;

	/**
	 * Constructor for the {@link Expense} Service.
	 *
	 * @param repository
	 * 	Repository responsible for persisting Expense instances
	 */
	public ExpenseService(final ExpenseRepository repository) {
		this.repository = repository;
	}

	/**
	 * Gets a list of all {@link Expense} that are active.
	 *
	 * @return List containing all Expense that are active
	 */
	public List<Expense> getActiveExpenses() {
		return this.repository.getAllByActiveOrderById(true);
	}

	/**
	 * Gets a {@link Expense} object with the provided id.
	 *
	 * @param id
	 * 	the unique identifier for the Expense to be found
	 *
	 * @return Expense object matching the provided id
	 */
	public Expense getExpenseById(final Long id) {
		return this.repository.findById(id).orElseThrow(() -> new ExpenseNotFoundException());
	}

	/**
	 * Persists the provided {@link Expense}.
	 *
	 * @param expense
	 * 	Expense to be persisted
	 *
	 * @return the Expense that was persisted
	 */
	public Expense saveExpense(final Expense expense) {
		return this.repository.save(expense);
	}

	/**
	 * Updates the {@link Expense} with the provided id with the provided attributes.
	 *
	 * @param id
	 * 	the unique identifier for the expense to be updated
	 * @param newExpense
	 * 	Expense object containing the updated attributes
	 *
	 * @return Expense containing the updated attributes
	 */
	public Expense updateExpense(final Long id, final Expense newExpense) {
		return this.repository.findById(id).map(expense -> {
			expense.setNotes(newExpense.getNotes());
			expense.setProject(newExpense.getProject());
			expense.setAmount(newExpense.getAmount());
			expense.setActive(true);
			return this.repository.save(expense);
		}).orElseThrow(() -> new ExpenseNotFoundException());
	}
}
