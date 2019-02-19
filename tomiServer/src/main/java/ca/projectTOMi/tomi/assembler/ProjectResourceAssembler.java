package ca.projectTOMi.tomi.assembler;

import java.net.URISyntaxException;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.controller.ProjectController;
import ca.projectTOMi.tomi.model.Project;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * ClientResourceAssembler is responsible for creating a standard resource for {@link Project}
 * objects.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Component
public final class ProjectResourceAssembler implements ResourceAssembler<Project, Resource<Project>> {
	private final Logger logger = LoggerFactory.getLogger("Project Assembler");

	@Override
	public Resource<Project> toResource(final Project project) {
		final Resource<Project> resource = new Resource<>(project,
			linkTo(methodOn(ProjectController.class).getProject(project.getId())).withSelfRel(),
			linkTo(methodOn(ProjectController.class).getActiveProjects()).withRel("clients"),
			linkTo(methodOn(ProjectController.class).setProjectInactive(project.getId())).withRel("delete"));

		try {
			resource.add(linkTo(methodOn(ProjectController.class).updateProject(project.getId(), project)).withRel("update"));
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}