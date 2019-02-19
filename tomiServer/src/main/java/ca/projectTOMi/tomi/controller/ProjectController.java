package ca.projectTOMi.tomi.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.EntryResourceAssembler;
import ca.projectTOMi.tomi.assembler.ProjectResourceAssembler;
import ca.projectTOMi.tomi.exception.InvalidIDPrefix;
import ca.projectTOMi.tomi.exception.ProjectNotFoundException;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.service.EntryService;
import ca.projectTOMi.tomi.service.ProjectService;
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

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Handles HTTP requests for {@link ca.projectTOMi.tomi.model.Project} objects in the ProjectTOMi
 * system.
 *
 * @author Karol Talbot
 * @version 1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class ProjectController {
	private final ProjectService projectService;
	private final EntryService entryService;
	private final ProjectResourceAssembler projectResourceAssembler;
	private final EntryResourceAssembler entryResourceAssembler;
	private final Logger logger = LoggerFactory.getLogger("Project Controller");

	@Autowired
	public ProjectController(final ProjectService projectService, final EntryService entryService, final ProjectResourceAssembler projectResourceAssembler, final EntryResourceAssembler entryResourceAssembler) {
		this.projectService = projectService;
		this.entryService = entryService;
		this.projectResourceAssembler = projectResourceAssembler;
		this.entryResourceAssembler = entryResourceAssembler;
	}

	/**
	 * Returns a resource representing the requested {@link Project} to the source of a GET request to
	 * /projects/id.
	 *
	 * @param id
	 * 	unique identifier for the Project
	 *
	 * @return Resource representing the Project object.
	 */
	@GetMapping ("/projects/{id}")
	public Resource<Project> getProject(@PathVariable final String id) {
		return this.projectResourceAssembler.toResource(this.projectService.getProjectById(id));
	}

	/**
	 * Returns a collection of all active {@link Project} the source of a GET request to /projects.
	 *
	 * @return Collection of resources representing all active Projects
	 */
	@GetMapping ("/projects")
	public Resources<Resource<Project>> getActiveProjects() {

		final List<Resource<Project>> project = this.projectService.getActiveProjects()
			.stream()
			.map(this.projectResourceAssembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(project,
			linkTo(methodOn(ProjectController.class).getActiveProjects()).withSelfRel());
	}

	/**
	 * Creates a new {@link Project} with the attributes provided in the POST request to /projects.
	 *
	 * @param newProject
	 * 	an Project object with required information.
	 *
	 * @return response containing links to the newly created Project
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed
	 */
	@PostMapping ("/projects")
	public ResponseEntity<?> createProject(@RequestBody final Project newProject) throws URISyntaxException {
		if (!newProject.getId().trim().matches("^\\p{Alpha}\\p{Alpha}\\d{0,5}+$")) {
			throw new InvalidIDPrefix();
		}
		newProject.setId(this.projectService.getId(newProject.getId()));
		final Resource<Project> resource = this.projectResourceAssembler.toResource(this.projectService.saveProject(newProject));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Updates the attributes for a {@link Project} with the provided id with the attributes provided
	 * in the PUT request to /projects/id.
	 *
	 * @param id
	 * 	the unique identifier for the Project to be updated
	 * @param newProject
	 * 	the updated Project
	 *
	 * @return response containing a link to the updated Project
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed
	 */
	@PutMapping ("/projects/{id}")
	public ResponseEntity<?> updateProject(@PathVariable final String id, @RequestBody final Project newProject) throws URISyntaxException {
		final Project updatedProject = this.projectService.updateProject(id, newProject);
		final Resource<Project> resource = this.projectResourceAssembler.toResource(updatedProject);

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Sets the requested {@link Project}'s active attribute false, removing it from the list of
	 * active Projects. Responds to the DELETE requests to /projects/id.
	 *
	 * @param id
	 * 	the unique identifier for the Project to be set inactive
	 *
	 * @return a response without any content
	 */
	@DeleteMapping ("/projects/{id}")
	public ResponseEntity<?> setProjectInactive(@PathVariable final String id) {
		final Project project = this.projectService.getProjectById(id);
		project.setActive(false);
		this.projectService.saveProject(project);

		return ResponseEntity.noContent().build();
	}

	@GetMapping ("/user_accounts/{id}/projects")
	public Resources<Resource<Project>> getProjectsByUserAccount(@PathVariable final Long id) {
		final List<Resource<Project>> project = this.projectService.getProjectByUserAccount(id)
			.stream()
			.map(this.projectResourceAssembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(project,
			linkTo(methodOn(ProjectController.class).getActiveProjects()).withSelfRel());
	}

	@GetMapping ("/projects/{projectId}/evaluate_entries")
	public Resources<Resource<Entry>> getEntriesToEvaluate(@PathVariable String projectId){
		final Project project = projectService.getProjectById(projectId);
		final List<Resource<Entry>> entries = this.entryService.getEntriesToEvaluate(project)
			.stream()
			.map(this.entryResourceAssembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(entries,
			linkTo(methodOn(ProjectController.class).getEntriesToEvaluate(projectId)).withSelfRel());
	}

	@ExceptionHandler ({ProjectNotFoundException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Project Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}
