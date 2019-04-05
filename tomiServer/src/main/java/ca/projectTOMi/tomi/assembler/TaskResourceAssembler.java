package ca.projectTOMi.tomi.assembler;

import ca.projectTOMi.tomi.authorization.wrapper.UserAuthLinkWrapper;
import ca.projectTOMi.tomi.controller.TaskController;
import ca.projectTOMi.tomi.model.Task;
import java.net.URISyntaxException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * TaskResourceAssembler is responsible for creating a standard resource for {@link Task}.
 *
 * @author Iliya Kiritchkov
 * @author Karol Talbot
 * @version 1.1
 */
@Component
public final class TaskResourceAssembler implements ResourceAssembler<UserAuthLinkWrapper<Task>, Resource<Task>> {
	private final Logger logger = LoggerFactory.getLogger("Task Assembler");

	@Override
	public Resource<Task> toResource(final UserAuthLinkWrapper<Task> userAuthLinkWrapper) {
		final Task task = userAuthLinkWrapper.getModelObject();
		final Resource<Task> resource = new Resource<>(task,
			linkTo(methodOn(TaskController.class).getTask(task.getId(), userAuthLinkWrapper.getManager())).withSelfRel(),
			linkTo(methodOn(TaskController.class).getActiveTasks(userAuthLinkWrapper.getManager())).withRel("tasks")
		);

		final Link deleteLink = linkTo(methodOn(TaskController.class).setTaskInactive(task.getId())).withRel("delete");
		if (userAuthLinkWrapper.getManager().linkAuthorization(deleteLink.getHref(), "DELETE")) {
			resource.add(deleteLink);
		}
		try {
			final Link updateLink = linkTo(methodOn(TaskController.class).updateTask(task.getId(), task, userAuthLinkWrapper.getManager())).withRel("update");
			if (userAuthLinkWrapper.getManager().linkAuthorization(updateLink.getHref(), "PUT")) {
				resource.add(updateLink);
			}
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}
