package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.exception.ExpenseNotFoundException;
import ca.projectTOMi.tomi.model.Expense;
import ca.projectTOMi.tomi.model.Project;
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
	/**
	 * Repository responsible for accessing and persisting for Expense objects.
	 */
	private final ExpenseRepository expenseRepository;

	/**
	 * Services for maintaining business logic surrounding {@link Project}s.
	 */
	private final ProjectService projectService;

	/**
	 * Constructor for the {@link Expense} Service.
	 *
	 * @param expenseRepository
	 * 	Repository responsible for persisting Expense instances
	 * @param projectService
	 * 	Service class responsible for handling Projects
	 */
	public ExpenseService(final ExpenseRepository expenseRepository,
	                      final ProjectService projectService) {
		this.expenseRepository = expenseRepository;
		this.projectService = projectService;
	}

	/**
	 * Gets a list of all {@link Expense} that are active.
	 *
	 * @param projectId
	 * 	The unique identifier for the project
	 *
	 * @return List containing all Expense that are active
	 */
	public List<Expense> getActiveExpensesByProject(final String projectId) {
		final Project project = this.projectService.getProjectById(projectId);
		return this.expenseRepository.getAllByActiveTrueAndProjectOrderById(project);
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
		return this.expenseRepository.findById(id).orElseThrow(ExpenseNotFoundException::new);
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
		return this.expenseRepository.save(expense);
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
		return this.expenseRepository.findById(id).map(expense -> {
			expense.setNotes(newExpense.getNotes());
			expense.setProject(newExpense.getProject());
			expense.setAmount(newExpense.getAmount());
			expense.setActive(true);
			return this.expenseRepository.save(expense);
		}).orElseThrow(ExpenseNotFoundException::new);
	}
}
