package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.exception.TaskNotFoundException;
import ca.projectTOMi.tomi.model.Task;
import ca.projectTOMi.tomi.persistence.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Provides services for {@link Task} objects.
 *
 * @author Iliya Kiritchkov
 * @version 1.1
 */
@Service
public final class TaskService {
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

    /**
     * Gets a list of all {@Link Task} objects that are active.
     * @return List containing all Tasks that are active.
     */
    public List<Task> getActiveTasks() {
        return repository.getAllByActive(true).stream().collect(Collectors.toList());
    }

    /**
     * Gets a list of all {@Link Task} objects that are active and billable.
     * @return List containing all Tasks that are active and billable.
     */
    public List<Task> getActiveAndBillable() {
        return repository.getAllByBillableAndActive(true, true).stream().collect(Collectors.toList());
    }

    /**
     * Gets a list of all {@Link Task} objects that are active and non-billable.
     * @return List containing all Tasks that are active and non-billable.
     */
    public List<Task> getActiveAndNonBillable() {
        return repository.getAllByBillableAndActive(false, true).stream().collect(Collectors.toList());
    }

    /**
     * Persists the provided {@Link Task}
     * @param task Task to be persisted.
     * @return Task that was persisted.
     */
    public Task saveTask(Task task) { return repository.save(task); }
}
