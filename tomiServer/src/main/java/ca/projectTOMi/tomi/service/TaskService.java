package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.exception.TaskNotFoundException;
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
    public TaskService(TaskRepository repository) { this.repository = repository; }

    /**
     * Updates the {@link Task} with the provided id with the provided attributes.
     *
     * @param id the unique identifier for the Task to update.
     * @param newTask Task object containing the updated attributes.
     * @return Task containing the updated attributes.
     */
    public Task updateTask(Long id, Task newTask) {
        return repository.findById(id).map(task -> {
            task.setName(newTask.getName());
            task.setBillable(newTask.isBillable());
            task.setActive(newTask.isActive());
            return repository.save(task);
        }).orElseThrow(() -> new TaskNotFoundException());
    }

    /**
     * Gets a {@link Task} object with the provided id.
     *
     * @param id the unique identifier for the Task to find.
     * @return Task object matching the provided id.
     */
    public Task getTask(Long id) {
        return repository.findById(id).orElseThrow(() -> new TaskNotFoundException());
    }


}
