package ca.projectTOMi.tomi.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import ca.projectTOMi.tomi.exception.ProjectNotFoundException;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link Project} objects.
 *
 * @author Karol Talbot
 * @version 1
 */

@Service
public final class ProjectService {
	/**
	 * Repository responsible for accessing and persisting for Project objects.
	 */
	private final ProjectRepository repository;

	/**
	 * Services for maintaining business logic surrounding {@link UserAccount}s.
	 */
	private final UserAccountService userAccountService;

	/**
	 * Services for maintaining business logic surrounding {@link ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy}s.
	 */
	private final ProjectAuthorizationService projectAuthorizationService;


	/**
	 * Constructor for the ProjectService service.
	 *
	 * @param repository
	 * 	Repository responsible for persisting Project instances
	 * @param userAccountService
	 * 	Service responsible for maintaining UserAccounts
	 * @param projectAuthorizationService
	 * 	Service responsible for maintaining ProjectAuthorizationPolicy objects
	 */
	@Autowired
	public ProjectService(final ProjectRepository repository,
	                      final UserAccountService userAccountService,
	                      final ProjectAuthorizationService projectAuthorizationService) {
		this.repository = repository;
		this.userAccountService = userAccountService;
		this.projectAuthorizationService = projectAuthorizationService;
	}

	/**
	 * Updates the project with the provided id with the provided attributes.
	 *
	 * @param id
	 * 	the unique identifier for the project to be updated
	 * @param newProject
	 * 	Project object containing the updated attributes
	 *
	 * @return Project containing the updated attributes
	 */
	public Project updateProject(final String id, final Project newProject) {
		return this.repository.findById(id).map(project -> {
			project.setProjectName(newProject.getProjectName());
			if (newProject.getBillableRate() != null) {
				project.setBillableRate(newProject.getBillableRate());
			}
			if (newProject.getBudget() != null) {
				project.setBudget(newProject.getBudget());
			}
			project.setClient(newProject.getClient());

			// Change Project Permissions
			newProject.setId(project.getId());
			this.projectAuthorizationService.changeProjectManager(project, newProject);

			project.setProjectManager(newProject.getProjectManager());
			project.setActive(true);
			return this.repository.save(project);
		}).orElseThrow(ProjectNotFoundException::new);
	}

	/**
	 * Gets a {@link Project} object with the provided id.
	 *
	 * @param id
	 * 	the unique identifier for the Project to be found
	 *
	 * @return Project object matching the provided id
	 */
	public Project getProjectById(final String id) {
		return this.repository.findById(id).orElseThrow(ProjectNotFoundException::new);
	}

	/**
	 * Gets a list of all projects that are active.
	 *
	 * @return List containing all projects that are active
	 */
	public List<Project> getActiveProjects() {
		return new ArrayList<>(this.repository.getAllByActiveOrderById(true));
	}

	/**
	 * Generates a sequential id based on a provided prefix for a {@link Project}.
	 *
	 * @param prefix
	 * 	the prefix for the id
	 *
	 * @return the generated id
	 */
	public String getId(final String prefix) {
		final List<String> prefixes = this.repository.getIds(prefix);
		final String top = prefixes.isEmpty() ? "0" : prefixes.get(0).substring(2).trim();
		final int i = Integer.parseInt(top) + 1;
		return String.format("%s%04d", prefix, i);
	}

	/**
	 * Deletes the provided {@link Project}.
	 *
	 * @param project
	 * 	Project to be persisted
	 */
	public void deleteProject(final Project project) {
		project.setActive(false);
		this.repository.save(project);
	}

	/**
	 * Creates a new Project.
	 *
	 * @param project
	 * 	the Project to be created
	 *
	 * @return The created project
	 */
	public Project createProject(final Project project) {
		project.setActive(true);
		project.setProjectMembers(new HashSet<>());
		final Project savedProject = this.repository.save(project);
		this.projectAuthorizationService.newProjectPolicies(savedProject);
		return savedProject;
	}

	/**
	 * Gets a list of Projects the provided user is a member of.
	 *
	 * @param userAccountId
	 * 	the unique identifier for the user
	 *
	 * @return The list of projects the user is a member of
	 */
	public List<Project> getProjectsByUserAccount(final Long userAccountId) {
		final UserAccount userAccount = this.userAccountService.getUserAccount(userAccountId);
		return this.repository.getAllByActiveTrueAndProjectMembersContainsOrderById(userAccount);
	}

	/**
	 * Adds a user to the provided project.
	 *
	 * @param projectId
	 * 	the unique identifier for the project
	 * @param userAccountId
	 * 	the unique identifier for the user
	 */
	public void addTeamMember(final String projectId, final Long userAccountId) {
		final Project project = this.repository.findById(projectId).orElseThrow(ProjectNotFoundException::new);
		final UserAccount userAccount = this.userAccountService.getUserAccount(userAccountId);
		if (!project.getProjectMembers().contains(userAccount)) {
			project.getProjectMembers().add(userAccount);
			this.projectAuthorizationService.addProjectMember(userAccount, project);
		}
		this.repository.save(project);
	}

	/**
	 * Removes a user from the provided project.
	 *
	 * @param projectId
	 * 	the unique identifier for the project
	 * @param userAccountId
	 * 	the unique identifier for the user
	 */
	public void removeTeamMember(final String projectId, final Long userAccountId) {
		final Project project = this.repository.findById(projectId).orElseThrow(ProjectNotFoundException::new);
		final UserAccount userAccount = this.userAccountService.getUserAccount(userAccountId);

		if (project.getProjectManager() != null && userAccount.equals(project.getProjectManager())) {
			this.projectAuthorizationService.changeProjectManager(project, null);
			project.setProjectManager(null);
		}

		project.getProjectMembers().remove(userAccount);
		this.repository.save(project);
	}

	/**
	 * Gets a list of UserAccounts working on the provided project.
	 *
	 * @param projectId
	 * 	The unique identifier for the project
	 *
	 * @return List of UserAccounts working on the project
	 */
	public List<UserAccount> getProjectMembers(final String projectId) {
		final Project project = this.repository.findById(projectId).orElseThrow(ProjectNotFoundException::new);
		return this.userAccountService.getUserAccountsByProjects(project);
	}
}
