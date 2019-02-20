package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.assembler.TaskResourceAssembler;
import ca.projectTOMi.tomi.exception.TaskNotFoundException;
import ca.projectTOMi.tomi.model.Task;
import ca.projectTOMi.tomi.service.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Handles HTTP requests for {@link Task} objects in the ProjectTOMi system.
 *
 * @author Iliya Kiritchkov and Karol Talbot
 * @version 2
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class TaskController {
	private final TaskResourceAssembler assembler;
	private final TaskService service;
	private final Logger logger = LoggerFactory.getLogger("Task Controller");

	@Autowired
	public TaskController(final TaskResourceAssembler assembler, final TaskService service) {
		this.assembler = assembler;
		this.service = service;
	}

	/**
	 * Returns a collection of all active {@link Task} objects to the source of a GET request to
	 * /tasks.
	 *
	 * @return Collection of resources representing all active Tasks.
	 */
	@GetMapping ("/tasks")
	public Resources<Resource<Task>> getActiveTasks() {
		final List<Resource<Task>> task = this.service.getActiveTasks()
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(task,
			linkTo(methodOn(TaskController.class).getActiveTasks()).withSelfRel());
	}

	/**
	 * Returns a collection of all active and billable {@link Task} objects to the source of a GET
	 * request to /tasks/billable.
	 *
	 * @return Collection of resources representing all active and billable Tasks.
	 */
	@GetMapping ("/tasks/billable")
	public Resources<Resource<Task>> getActiveAndBillableTasks() {
		final List<Resource<Task>> task = this.service.getActiveAndBillable()
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(task,
			linkTo(methodOn(TaskController.class).getActiveAndBillableTasks()).withSelfRel());
	}

	/**
	 * Returns a collection of all active and non-billable {@link Task} objects to the source of a GET
	 * request to /tasks/nonbillable.
	 *
	 * @return Collection of resources representing all active and non-billable Tasks.
	 */
	@GetMapping ("/tasks/nonbillable")
	public Resources<Resource<Task>> getActiveAndNonBillableTasks() {
		final List<Resource<Task>> task = this.service.getActiveAndNonBillable()
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(task,
			linkTo(methodOn(TaskController.class).getActiveAndNonBillableTasks()).withSelfRel());
	}

	/**
	 * Returns a resource representing the requested {@link Task} to the source of a GET request to
	 * /tasks/id.
	 *
	 * @param id
	 * 	unique identifier for the Task.
	 *
	 * @return Resource representing the Task object.
	 */
	@GetMapping ("/tasks/{id}")
	public Resource<Task> getTask(@PathVariable final Long id) {
		final Task task = this.service.getTask(id);

		return this.assembler.toResource(task);
	}

	/**
	 * Creates a new {@link Task} with the attributes provided in the POST request to /tasks.
	 *
	 * @param newTask
	 * 	a Task object with required information.
	 *
	 * @return response containing links to the newly created Task.
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed.
	 */
	@PostMapping ("/tasks")
	public ResponseEntity<?> createTask(@RequestBody final Task newTask) throws URISyntaxException {
		final Resource<Task> resource = this.assembler.toResource(this.service.createTask(newTask));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Updates the attributes for a {@link Task} with the provided id with the attributes provided in
	 * the PUT request to /tasks/id.
	 *
	 * @param id
	 * 	the unique identifier for the Task to update.
	 * @param newTask
	 * 	the updated Task.
	 *
	 * @return response containing a link to the updated Task.
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed.
	 */
	@PutMapping ("/tasks/{id}")
	public ResponseEntity<?> updateTask(@PathVariable final Long id, @RequestBody final Task newTask) throws URISyntaxException {
		final Task updatedTask = this.service.updateTask(id, newTask);
		final Resource<Task> resource = this.assembler.toResource(updatedTask);

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Sets the requested {@link Task}'s active attribute to false, removing it from the list of
	 * active Tasks. Responds to the DELETE requests to /tasks/id.
	 *
	 * @param id
	 * 	the unique identifier for the task to be set inactive.
	 *
	 * @return a response without any content.
	 */
	@DeleteMapping ("/tasks/{id}")
	public ResponseEntity<?> setTaskInactive(@PathVariable final Long id) {
		final Task task = this.service.getTask(id);
		task.setActive(false);
		this.service.saveTask(task);

		return ResponseEntity.noContent().build();
	}

	@ExceptionHandler ({TaskNotFoundException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Task Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}
