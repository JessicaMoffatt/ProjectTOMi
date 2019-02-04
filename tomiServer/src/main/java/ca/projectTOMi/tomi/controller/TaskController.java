package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.assembler.TaskResourceAssembler;
import ca.projectTOMi.tomi.model.Task;
import ca.projectTOMi.tomi.service.TaskService;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Handles HTTP requests for {@Link Task} objects in the ProjectTOMi system.
 *
 * @author Iliya Kiritchkov
 * @version 1
 */
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {
    private TaskResourceAssembler assembler;
    private TaskService service;

    /**
     * Constructor for this TaskController.
     *
     * @param assembler Converts Task objects into resources.
     * @param service   Provides services required for {@Link Task} objects.
     */
    public TaskController(TaskResourceAssembler assembler, TaskService service) {
        this.assembler = assembler;
        this.service = service;
    }

    /**
     * Returns a collection of all active {@Link Task} objects to the source of a GET request to /tasks.
     *
     * @return Collection of resources representing all active Tasks.
     */
    @GetMapping("/tasks")
    public Resources<Resource<Task>> getActiveTasks() {
        List<Resource<Task>> task = service.getActiveTasks().stream().map(assembler::toResource).collect(Collectors.toList());

        return new Resources<>(task,
                linkTo(methodOn(TaskController.class).getActiveTasks()).withSelfRel());
    }

    /**
     * Returns a collection of all active and billable {@Link Task} objects to the source of a GET request to /tasks/billable.
     *
     * @return Collection of resources representing all active and billable Tasks.
     */
    @GetMapping ("/tasks/billable")
    public Resources<Resource<Task>> getActiveAndBillableTasks() {
        List<Resource<Task>> task = service.getActiveAndBillable().stream().map(assembler::toResource).collect(Collectors.toList());

        return new Resources<>(task,
                linkTo(methodOn(TaskController.class).getActiveAndBillableTasks()).withSelfRel());
    }

    /**
     * Returns a collection of all active and non-billable {@Link Task} objects to the source of a GET request to /tasks/nonbillable.
     *
     * @return Collection of resources representing all active and non-billable Tasks.
     */
    @GetMapping ("/tasks/nonbillable")
    public Resources<Resource<Task>> getActiveAndNonBillableTasks() {
        List<Resource<Task>> task = service.getActiveAndNonBillable().stream().map(assembler::toResource).collect(Collectors.toList());

        return new Resources<>(task,
                linkTo(methodOn(TaskController.class).getActiveAndNonBillableTasks()).withSelfRel());
    }

    /**
     * Returns a resource representing the requested {@Link Task} to the source of a GET request to /tasks/id.
     *
     * @param id unique identifier for the Task.
     * @return Resource representing the Task object.
     */
    @GetMapping("/tasks/{id}")
    public Resource<Task> getTask(@PathVariable Long id) {
        Task task = service.getTask(id);

        return assembler.toResource(task);
    }

    /**
     * Creates a new {@Link Task} with the attributes provided in the POST request to /tasks.
     *
     * @param newTask a Task object with required information.
     * @return response containing links to the newly created Task.
     * @throws URISyntaxException when the created URI is unable to be parsed.
     */
    @PostMapping("/tasks")
    public ResponseEntity<?> createTask(@RequestBody Task newTask) throws URISyntaxException {
        Resource<Task> resource = assembler.toResource(service.saveTask(newTask));

        return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
    }

    /**
     * Updates the attributes for a {@Link Task} with the provided id with the attributes provided in the PUT request to /tasks/id.
     *
     * @param id      the unique identifier for the Task to update.
     * @param newTask the updated Task.
     * @return response containing a link to the updated Task.
     * @throws URISyntaxException when the created URI is unable to be parsed.
     */
    @PutMapping("/tasks/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task newTask) throws URISyntaxException {
        Task updatedTask = service.updateTask(id, newTask);
        Resource<Task> resource = assembler.toResource(updatedTask);
        return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
    }

    /**
     * Sets the requested {@Link Task}'s active attribute to false, removing it from the list of active Tasks.
     * Responds to the DELETE requests to /tasks/id.
     *
     * @param id the unique identifier for the task to be set inactive.
     * @return a response without any content.
     */
    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<?> setTaskInactive(@PathVariable Long id) {
        Task task = service.getTask(id);
        task.setActive(false);
        service.saveTask(task);

        return ResponseEntity.noContent().build();
    }
}
