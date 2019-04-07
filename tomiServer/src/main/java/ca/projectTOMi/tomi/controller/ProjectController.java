package ca.projectTOMi.tomi.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.EntryResourceAssembler;
import ca.projectTOMi.tomi.assembler.ProjectResourceAssembler;
import ca.projectTOMi.tomi.authorization.manager.ProjectAuthManager;
import ca.projectTOMi.tomi.authorization.wrapper.ProjectAuthLinkWrapper;
import ca.projectTOMi.tomi.authorization.wrapper.TimesheetAuthLinkWrapper;
import ca.projectTOMi.tomi.exception.EmptyProjectListException;
import ca.projectTOMi.tomi.exception.InvalidIDPrefixException;
import ca.projectTOMi.tomi.exception.ProjectNotFoundException;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.Status;
import ca.projectTOMi.tomi.model.UserAccount;
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
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * Rest Controller that handles HTTP requests for {@link Project} objects in the TOMi system.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class ProjectController {
	/**
	 * Provides services for maintaining Projects.
	 */
	private final ProjectService projectService;

	/**
	 * Provides services for maintaining Entries and Timesheets.
	 */
	private final EntryService entryService;

	/**
	 * Converts Project model objects into HATEOAS Resources.
	 */
	private final ProjectResourceAssembler projectResourceAssembler;

	/**
	 * Converts Entry model objects into HATEOAS Resources.
	 */
	private final EntryResourceAssembler entryResourceAssembler;

	/**
	 * Provides access to system logs for error reporting purposes.
	 */
	private final Logger logger = LoggerFactory.getLogger("Project Controller");

	/**
	 * Creates the ProjectController.
	 *
	 * @param projectService
	 * 	Provides services for maintaining Projects
	 * @param entryService
	 * 	Provides services for maintaining Entries and Timesheets
	 * @param projectResourceAssembler
	 * 	Converts Projects to Resources
	 * @param entryResourceAssembler
	 * 	Converts Entries to Resources
	 */
	@Autowired
	public ProjectController(final ProjectService projectService,
	                         final EntryService entryService,
	                         final ProjectResourceAssembler projectResourceAssembler,
	                         final EntryResourceAssembler entryResourceAssembler) {
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
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Resource representing the Project object.
	 */
	@GetMapping ("/projects/{id}")
	public Resource<Project> getProject(@PathVariable final String id,
	                                    @RequestAttribute final ProjectAuthManager authMan) {
		return this.projectResourceAssembler.toResource(new ProjectAuthLinkWrapper<>(authMan.filterFields(this.projectService.getProjectById(id)), authMan));
	}

	/**
	 * Returns a collection of all active {@link Project} the source of a GET request to /projects.
	 *
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Collection of resources representing all active Projects
	 */
	@GetMapping ("/projects")
	public Resources<Resource<Project>> getActiveProjects(@RequestAttribute final ProjectAuthManager authMan) {
		final List<Project> projects = this.projectService.getActiveProjects();
		final List<Resource<Project>> projectResources = authMan.filterList(projects)
			.stream()
			.map(project -> (new ProjectAuthLinkWrapper<>(project, authMan)))
			.map(this.projectResourceAssembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(projectResources,
			linkTo(methodOn(ProjectController.class).getActiveProjects(authMan)).withSelfRel());
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
		if (newProject.getId() == null || !newProject.getId().trim().matches("^\\p{Alpha}\\p{Alpha}\\d{0,5}+$")) {
			throw new InvalidIDPrefixException();
		}
		newProject.setId(this.projectService.getId(newProject.getId()));
		final Resource<Project> resource = this.projectResourceAssembler.toResource(new ProjectAuthLinkWrapper<>(this.projectService.createProject(newProject), null));

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
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return response containing a link to the updated Project
	 *
	 * @throws URISyntaxException
	 * 	when the created URI is unable to be parsed
	 */
	@PutMapping ("/projects/{id}")
	public ResponseEntity<?> updateProject(@PathVariable final String id,
	                                       @RequestBody final Project newProject,
	                                       @RequestAttribute final ProjectAuthManager authMan) throws URISyntaxException {
		newProject.setActive(true);
		final Project updatedProject = authMan.filterFields(this.projectService.updateProject(id, newProject));
		final Resource<Project> resource = this.projectResourceAssembler.toResource(new ProjectAuthLinkWrapper<>(updatedProject, authMan));

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
		this.projectService.deleteProject(project);

		return ResponseEntity.noContent().build();
	}

	/**
	 * Gets a list of Projects a UserAccount is assigned to.
	 *
	 * @param userAccountId
	 * 	The Unique identifier for the UserAccount
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return List of Resources representing Projects a user is assigned to
	 */
	@GetMapping ("/user_accounts/{userAccountId}/projects")
	public Resources<Resource<Project>> getProjectsByUserAccount(@PathVariable final Long userAccountId,
	                                                             @RequestAttribute final ProjectAuthManager authMan) {
		final List<Project> projects = this.projectService.getProjectsByUserAccount(userAccountId);
		if (projects.isEmpty()) {
			throw new EmptyProjectListException();
		}
		final List<Resource<Project>> projectResources = authMan.filterList(projects)
			.stream()
			.map(project -> (new ProjectAuthLinkWrapper<>(project, authMan)))
			.map(this.projectResourceAssembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(projectResources,
			linkTo(methodOn(ProjectController.class).getProjectsByUserAccount(userAccountId, authMan)).withSelfRel());
	}

	/**
	 * Returns a list of Entries that need to be evaluated by a project manager for a specific
	 * Project.
	 *
	 * @param projectId
	 * 	The unique identifier for the Project
	 *
	 * @return List of Resources representing Entry objects that need to be evaluated
	 */
	@GetMapping ("/projects/{projectId}/evaluate_entries")
	public Resources<Resource<Entry>> getEntriesToEvaluate(@PathVariable final String projectId) {
		final Project project = this.projectService.getProjectById(projectId);
		final List<Resource<Entry>> entries = this.entryService.getEntriesToEvaluate(project)
			.stream()
			.map(entry -> (new TimesheetAuthLinkWrapper<>(entry, null)))
			.map(this.entryResourceAssembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(entries,
			linkTo(methodOn(ProjectController.class).getEntriesToEvaluate(projectId)).withSelfRel());
	}

	/**
	 * Updates the status an Entry based on a project managers evaluation.
	 *
	 * @param projectId
	 * 	The unique identifier for the Project
	 * @param entryId
	 * 	The unique identifier for the Entry
	 * @param status
	 * 	The updated status provided by the project manager
	 *
	 * @return Response informing the client if the request was accepted
	 */
	@PutMapping ("/projects/{projectId}/entries/{entryId}")
	public ResponseEntity<?> evaluateEntry(@PathVariable final String projectId,
	                                       @PathVariable final Long entryId,
	                                       @RequestBody final Status status) {
		if (status != Status.APPROVED && status != Status.REJECTED) {
			return ResponseEntity.badRequest().build();
		}
		return this.entryService.evaluateEntry(entryId, status) ? ResponseEntity.accepted().build() : ResponseEntity.badRequest().build();
	}

	/**
	 * Adds a specified UserAccount to a specified Project.
	 *
	 * @param projectId
	 * 	The unique identifier for the Project
	 * @param userAccountId
	 * 	The unique identifier for the UserAccount
	 *
	 * @return Http response informing the client if the request was accepted
	 */
	@PutMapping ("/projects/{projectId}/add_member/{userAccountId}")
	public ResponseEntity<?> addTeamMember(@PathVariable final String projectId,
	                                       @PathVariable final Long userAccountId) {
		this.projectService.addTeamMember(projectId, userAccountId);
		return ResponseEntity.accepted().build();
	}

	/**
	 * Removes a specified UserAccount to a specified Project.
	 *
	 * @param projectId
	 * 	The unique identifier for the Project
	 * @param userAccountId
	 * 	The unique identifier for the UserAccount
	 *
	 * @return Http response informing the client if the request was accepted
	 */
	@PutMapping ("/projects/{projectId}/remove_member/{userAccountId}")
	public ResponseEntity<?> removeTeamMember(@PathVariable final String projectId,
	                                          @PathVariable final Long userAccountId) {
		this.projectService.removeTeamMember(projectId, userAccountId);
		return ResponseEntity.accepted().build();
	}

	/**
	 * Returns as list of UserAccounts assigned to a Project.
	 *
	 * @param projectId
	 * 	The unique identifier for the Project
	 *
	 * @return List of UserAccounts assigned to a project
	 */
	@GetMapping ("/projects/{projectId}/members")
	public List<UserAccount> getProjectMembers(@PathVariable final String projectId) {
		return this.projectService.getProjectMembers(projectId);
	}

	/**
	 * Informs the client that an empty list exception occurred.
	 *
	 * @param e
	 * 	The exception that had occurred
	 *
	 * @return A 204 Response
	 */
	@ExceptionHandler ({EmptyProjectListException.class})
	public ResponseEntity<?> handleEmptyList(final Exception e) {
		return ResponseEntity.status(204).build();
	}

	/**
	 * Informs the client that an exception has occurred. In order to keep the server inner workings
	 * private a generic 400 bad request is used.
	 *
	 * @param e
	 * 	The exception that had occurred
	 *
	 * @return A 400 Bad Request Response
	 */
	@ExceptionHandler ({ProjectNotFoundException.class, InvalidIDPrefixException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Project Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}
