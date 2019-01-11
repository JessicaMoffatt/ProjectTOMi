package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.model.Task;
import ca.projectTOMi.tomi.persistence.TaskRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * TaskController is used to control the flow of data regarding Tasks to/from the view.
 */
@RestController
public class TaskController {

    /**
     * The repository for the Task class.
     */
    private TaskRepository repository;

    public TaskController(TaskRepository repository) { this.repository = repository; }

    @PostMapping("/tasks")
    public Task createTask(@RequestBody Task task) { return repository.save(task); }

    @GetMapping("/tasks")
    public List<Task> all() { return repository.findAll(); }

    @GetMapping("/tasks/billable")
    public List<Task> findBillable() { return repository.getAllByBillable(true); }


}
