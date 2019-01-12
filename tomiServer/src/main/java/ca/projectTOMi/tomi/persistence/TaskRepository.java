package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * TaskRepository is used to persist and retrieve data regarding {@link Task} from the database.
 */
public interface TaskRepository extends JpaRepository<Task, Long> {
}
