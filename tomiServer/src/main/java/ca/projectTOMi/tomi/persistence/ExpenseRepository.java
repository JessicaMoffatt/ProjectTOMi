package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * ExpenseRepository is used to persist and retrieve data regarding {@link Expense} from the
 * database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
  /**
   * Get all {@link Expense}s that have the provided active status.
   *
   * @param active
   *   if the Expense is active
   *
   * @return List containing all Expenses with the provided active state
   */
  public List<Expense> getAllByActive(boolean active);
}
