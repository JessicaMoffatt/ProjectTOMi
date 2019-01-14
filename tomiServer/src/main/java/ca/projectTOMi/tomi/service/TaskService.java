package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.model.Task;
import ca.projectTOMi.tomi.persistence.TaskRepository;

/**
 * Provides services for {@link Task} objects.
 *
 * @author Iliya Kiritchkov
 * @version 1
 */
public class TaskService {
    private TaskRepository repository;

    /**
     * Constructor for the TaskService component.
     * @param repository Repository responsible for persisting {@link Task} instances.
     */
    public TaskRepository(TaskRepository repository) { this.repository = repository; }

    public Task updateTask(Long id, Task newTask) {
        return repository.findById(id).map(task -> {
            task.setName(newTask.getName());
            task.setBillable(newTask.isBillable());
            task.setActive(newTask.isActive());
            return repository.save(task);
        }).orElse(() -> new TaskNotFoundException());
    }
}
