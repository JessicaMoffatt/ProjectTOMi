package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.model.Expense;
import ca.projectTOMi.tomi.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * ExpenseRepository is used to persist and retrieve data regarding {@link Expense} from the
 * database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

	List<Expense> getAllByActiveTrueAndProjectOrderById(Project project);
}
