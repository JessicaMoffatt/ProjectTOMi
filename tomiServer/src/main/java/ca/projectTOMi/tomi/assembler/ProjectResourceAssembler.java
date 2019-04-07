package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URISyntaxException;
import ca.projectTOMi.tomi.authorization.wrapper.ProjectAuthLinkWrapper;
import ca.projectTOMi.tomi.controller.ProjectController;
import ca.projectTOMi.tomi.controller.ReportController;
import ca.projectTOMi.tomi.model.Project;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * ProjectResourceAssembler is responsible for creating a standard resource for {@link Project}
 * objects.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Component
public final class ProjectResourceAssembler implements ResourceAssembler<ProjectAuthLinkWrapper<Project>, Resource<Project>> {
	/**
	 * Provides access to the logs for error reporting.
	 */
	private final Logger logger = LoggerFactory.getLogger("Project Assembler");

	/**
	 * Converts a Project instance into a Resource instance with HATEOAS links based on the requesting
	 * user's {@link ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy}s.
	 *
	 * @param projectAuthLinkWrapper
	 * 	a {@link ca.projectTOMi.tomi.model.Project} object paired with the {@link
	 * 	ca.projectTOMi.tomi.authorization.manager.AuthManager} created for the request
	 *
	 * @return Resource of the provided Project
	 */
	@Override
	public Resource<Project> toResource(final ProjectAuthLinkWrapper<Project> projectAuthLinkWrapper) {
		final Project project = projectAuthLinkWrapper.getModelObject();
		final Resource<Project> resource = new Resource<>(project,
			linkTo(methodOn(ProjectController.class).getProject(project.getId(), projectAuthLinkWrapper.getManager())).withSelfRel(),
			linkTo(methodOn(ProjectController.class).getActiveProjects(projectAuthLinkWrapper.getManager())).withRel("projects"),
			linkTo(methodOn(ProjectController.class).setProjectInactive(project.getId())).withRel("delete"),
			linkTo(methodOn(ProjectController.class).getEntriesToEvaluate(project.getId())).withRel("entries"),
			linkTo(methodOn(ProjectController.class).getProjectMembers(project.getId())).withRel("members"),
			linkTo(methodOn(ReportController.class).getBudgetReport(project.getId())).withRel("budget")
		);

		try {
			resource.add(linkTo(methodOn(ProjectController.class).updateProject(project.getId(), project, projectAuthLinkWrapper.getManager())).withRel("update"));
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}