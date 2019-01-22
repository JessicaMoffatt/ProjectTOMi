package ca.projectTOMi.tomi.assembler;

import ca.projectTOMi.tomi.controller.TaskController;
import ca.projectTOMi.tomi.model.Task;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * TaskResourceAssembler is responsible for creating a standard resource for {@link Task}.
 *
 * @author Iliya Kiritchkov
 * @version 1
 */
@Component
public final class TaskResourceAssembler implements ResourceAssembler<Task, Resource<Task>> {

    @Override
    public Resource<Task> toResource(Task task) {
        Resource<Task> resource = new Resource<>(task,
                linkTo(methodOn(TaskController.class).getTask(task.getId())).withSelfRel(),
                linkTo(methodOn(TaskController.class).getActiveTasks()).withRel("tasks"),
                linkTo(methodOn(TaskController.class).getActiveAndBillableTasks()).withRel("tasks/billable"),
                linkTo(methodOn(TaskController.class).getActiveAndNonBillableTasks()).withRel("tasks/nonbillable"),
                linkTo(methodOn(TaskController.class).setTaskInactive(task.getId())).withRel("delete")
        );

        try {
            resource.add(linkTo(methodOn(TaskController.class).updateTask(task.getId(), task)).withRel("update"));
        } catch (URISyntaxException e) {
            System.out.println(e);
        }

        return resource;
    }
}
