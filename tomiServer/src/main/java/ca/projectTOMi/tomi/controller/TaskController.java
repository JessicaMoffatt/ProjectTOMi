package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.assembler.TaskResourceAssembler;
import ca.projectTOMi.tomi.authorization.manager.UserAuthManager;
import ca.projectTOMi.tomi.authorization.wrapper.UserAuthLinkWrapper;
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
import org.springframework.web.bind.annotation.RequestAttribute;
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
 * @author Karol Talbot
 * @author Iliya Kiritchkov
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
	public Resources<Resource<Task>> getActiveTasks(@RequestAttribute final UserAuthManager authMan) {
		final List<Resource<Task>> taskList = this.service.getActiveTasks()
			.stream()
			.map(task -> new UserAuthLinkWrapper<>(task, authMan))
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(taskList,
			linkTo(methodOn(TaskController.class).getActiveTasks(authMan)).withSelfRel());
	}

	/**
	 * Returns a resource representing the requested {@link Task} to the source of a GET request to
	 * /tasks/id.
	 *
	 * @param taskId
	 * 	unique identifier for the Task.
	 *
	 * @return Resource representing the Task object.
	 */
	@GetMapping ("/tasks/{taskId}")
	public Resource<Task> getTask(@PathVariable final Long taskId,
	                              @RequestAttribute final UserAuthManager authMan) {
		return this.assembler.toResource(new UserAuthLinkWrapper<>(this.service.getTask(taskId), authMan));
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
	public ResponseEntity<?> createTask(@RequestBody final Task newTask,
	                                    @RequestAttribute final UserAuthManager authMan) throws URISyntaxException {
		final Resource<Task> resource = this.assembler.toResource(new UserAuthLinkWrapper<>(this.service.createTask(newTask), authMan));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Updates the attributes for a {@link Task} with the provided id with the attributes provided in
	 * the PUT request to /tasks/id.
	 *
	 * @param taskId
	 * 	the unique identifier for the Task to update.
	 * @param newTask
	 * 	the updated Task.
	 *
	 * @return response containing a link to the updated Task.
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed.
	 */
	@PutMapping ("/tasks/{taskId}")
	public ResponseEntity<?> updateTask(@PathVariable final Long taskId,
	                                    @RequestBody final Task newTask,
	                                    @RequestAttribute final UserAuthManager authMan) throws URISyntaxException {
		final Task updatedTask = this.service.updateTask(taskId, newTask);
		final Resource<Task> resource = this.assembler.toResource(new UserAuthLinkWrapper<>(updatedTask, authMan));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Sets the requested {@link Task}'s active attribute to false, removing it from the list of
	 * active Tasks. Responds to the DELETE requests to /tasks/id.
	 *
	 * @param taskId
	 * 	the unique identifier for the task to be set inactive.
	 *
	 * @return a response without any content.
	 */
	@DeleteMapping ("/tasks/{taskId}")
	public ResponseEntity<?> setTaskInactive(@PathVariable final Long taskId) {
		final Task task = this.service.getTask(taskId);
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
