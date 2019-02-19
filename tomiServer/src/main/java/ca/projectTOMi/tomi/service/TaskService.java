package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.exception.TaskNotFoundException;
import ca.projectTOMi.tomi.model.Task;
import ca.projectTOMi.tomi.persistence.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Provides services for {@link Task} objects.
 *
 * @author Iliya Kiritchkov and Karol Talbot
 * @version 1.1
 */
@Service
public final class TaskService {
	private final TaskRepository repository;

	/**
	 * Constructor for the TaskService component.
	 *
	 * @param repository
	 * 	Repository responsible for persisting {@link Task} instances.
	 */
	public TaskService(final TaskRepository repository) {
		this.repository = repository;
	}

	/**
	 * Updates the {@link Task} with the provided id with the provided attributes.
	 *
	 * @param id
	 * 	the unique identifier for the Task to update.
	 * @param newTask
	 * 	Task object containing the updated attributes.
	 *
	 * @return Task containing the updated attributes.
	 */
	public Task updateTask(final Long id, final Task newTask) {
		return this.repository.findById(id).map(task -> {
			task.setName(newTask.getName());
			task.setBillable(newTask.isBillable());
			task.setActive(true);
			return this.repository.save(task);
		}).orElseThrow(TaskNotFoundException::new);
	}

	/**
	 * Gets a {@link Task} object with the provided id.
	 *
	 * @param id
	 * 	the unique identifier for the Task to find.
	 *
	 * @return Task object matching the provided id.
	 */
	public Task getTask(final Long id) {
		return this.repository.findById(id).orElseThrow(TaskNotFoundException::new);
	}

	/**
	 * Gets a list of all {@link Task} objects that are active.
	 *
	 * @return List containing all Tasks that are active.
	 */
	public List<Task> getActiveTasks() {
		return new ArrayList<>(this.repository.getAllByActiveOrderById(true));
	}

	/**
	 * Gets a list of all {@link Task} objects that are active and billable.
	 *
	 * @return List containing all Tasks that are active and billable.
	 */
	public List<Task> getActiveAndBillable() {
		return new ArrayList<>(this.repository.getAllByBillableAndActiveOrderById(true, true));
	}

	/**
	 * Gets a list of all {@link Task} objects that are active and non-billable.
	 *
	 * @return List containing all Tasks that are active and non-billable.
	 */
	public List<Task> getActiveAndNonBillable() {
		return new ArrayList<>(this.repository.getAllByBillableAndActiveOrderById(false, true));
	}

	/**
	 * Persists the provided {@link Task}
	 *
	 * @param task
	 * 	Task to be persisted.
	 *
	 * @return Task that was persisted.
	 */
	public Task createTask(final Task task) {
		Task taskToSave = this.repository.findByName(task.getName());
		taskToSave = taskToSave == null ? new Task() : taskToSave;
		taskToSave.setActive(true);
		taskToSave.setBillable(task.isBillable());
		taskToSave.setName(task.getName());
		return this.repository.save(taskToSave);
	}

	public Task saveTask(final Task task) {
		return this.repository.save(task);
	}
}
