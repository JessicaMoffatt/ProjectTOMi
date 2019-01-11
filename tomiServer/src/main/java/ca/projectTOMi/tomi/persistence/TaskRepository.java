package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * TaskRepository is used to persist and retrieve data regarding {@Link Task} from the database.
 */
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Gets the list of tasks.
     * @return The list of tasks.
     */
    public List<Task> getAll();

    /**
     * Gets the list of tasks by billable status.
     * @param billable
     * @return The list of tasks that correspond to the billable status.
     */
    public List<Task> getAllByBillable(boolean billable);

    /**
     * Deletes a task.
     * @param toDelete - The task to delete.
     * @return True if successful, otherwise false.
     */
    public boolean deleteTask(Task toDelete);

}
