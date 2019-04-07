package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * TaskRepository is used to persist and retrieve data regarding {@link Task} from the database.
 *
 * @author Iliya Kiritchkov
 * @version 1
 */
public interface TaskRepository extends JpaRepository<Task, Long> {

	/**
	 * Gets the list of {@link Task} by billable and active statuses.
	 *
	 * @param billable
	 * 	if the Task is billable.
	 * @param active
	 * 	if the Task is active.
	 *
	 * @return The list of Tasks that correspond to the billable and active statuses.
	 */
	List<Task> getAllByBillableAndActiveOrderById(boolean billable, boolean active);

	/**
	 * Finds a Task with the provided name.
	 *
	 * @param name
	 * 	The name of the Task to be found
	 *
	 * @return The Task with the provided name
	 */
	Task findByName(String name);

	/**
	 * Gets the list of {@link Task} by active status.
	 *
	 * @param active
	 * 	if the Task is active.
	 *
	 * @return The list of Tasks that are active.
	 */
	List<Task> getAllByActiveOrderById(boolean active);
}