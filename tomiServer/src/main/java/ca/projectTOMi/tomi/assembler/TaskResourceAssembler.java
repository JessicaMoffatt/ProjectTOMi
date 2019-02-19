package ca.projectTOMi.tomi.assembler;

import ca.projectTOMi.tomi.controller.TaskController;
import ca.projectTOMi.tomi.model.Task;
import java.net.URISyntaxException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * TaskResourceAssembler is responsible for creating a standard resource for {@link Task}.
 *
 * @author Iliya Kiritchkov and Karol Talbot
 * @version 1.1
 *
 */
@Component
public final class TaskResourceAssembler implements ResourceAssembler<Task, Resource<Task>> {
	private final Logger logger = LoggerFactory.getLogger("Task Assembler");

	@Override
	public Resource<Task> toResource(final Task task) {
		final Resource<Task> resource = new Resource<>(task,
			linkTo(methodOn(TaskController.class).getTask(task.getId())).withSelfRel(),
			linkTo(methodOn(TaskController.class).getActiveTasks()).withRel("tasks"),
			linkTo(methodOn(TaskController.class).getActiveAndBillableTasks()).withRel("tasks/billable"),
			linkTo(methodOn(TaskController.class).getActiveAndNonBillableTasks()).withRel("tasks/nonbillable"),
			linkTo(methodOn(TaskController.class).setTaskInactive(task.getId())).withRel("delete")
		);

		try {
			resource.add(linkTo(methodOn(TaskController.class).updateTask(task.getId(), task)).withRel("update"));
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}
