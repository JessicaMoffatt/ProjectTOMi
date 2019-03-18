package ca.projectTOMi.tomi.service;

import java.util.ArrayList;
import java.util.List;
import ca.projectTOMi.tomi.exception.ProjectManagerException;
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
	private final ProjectRepository repository;
	private final UserAccountService userAccountService;
	private final ProjectAuthService projectAuthService;

	/**
	 * Constructor for the ProjectService service.
	 *
	 * @param repository
	 * 	Repository responsible for persisting Project instances
	 */
	@Autowired
	public ProjectService(final ProjectRepository repository,
	                      final UserAccountService userAccountService,
	                      final ProjectAuthService projectAuthService) {
		this.repository = repository;
		this.userAccountService = userAccountService;
		this.projectAuthService = projectAuthService;
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
			this.projectAuthService.changeProjectManager(project, newProject);

			project.setProjectManager(newProject.getProjectManager());
			project.setProjectMembers(newProject.getProjectMembers());
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
	 * Persists the provided {@link Project}.
	 *
	 * @param project
	 * 	Project to be persisted
	 *
	 * @return the Project that was persisted
	 */
	public Project deleteProject(final Project project) {
		project.setActive(false);
		return this.repository.save(project);
	}

	public Project createProject(final Project project){
		final Project savedProject = this.repository.save(project);
		this.projectAuthService.newProjectPolicies(savedProject);
		return savedProject;
	}

	public List<Project> getProjectByUserAccount(final Long userAccountId) {
		final UserAccount userAccount = this.userAccountService.getUserAccount(userAccountId);
		return this.repository.getAllByActiveTrueAndProjectMembersContainsOrderById(userAccount);
	}

	public void addTeamMember(final String projectId, final Long userAccountId){
		final Project project = this.repository.findById(projectId).orElseThrow(ProjectNotFoundException::new);
		final UserAccount userAccount = this.userAccountService.getUserAccount(userAccountId);

		if(!project.getProjectMembers().contains(userAccount)) {
			project.getProjectMembers().add(userAccount);
			this.projectAuthService.addProjectMember(userAccount, project);
		}
		this.repository.save(project);
	}

	public void removeTeamMember(final String projectId, final Long userAccountId){
		final Project project = this.repository.findById(projectId).orElseThrow(ProjectNotFoundException::new);
		final UserAccount userAccount = this.userAccountService.getUserAccount(userAccountId);

		if(userAccount.equals(project.getProjectManager())){
			throw new ProjectManagerException();
		}

		if(project.getProjectMembers().contains(userAccount)) {
			project.getProjectMembers().remove(userAccount);
		}
		this.repository.save(project);
	}

	public List<UserAccount> getProjectMembers(final String projectId) {
		final Project project = this.repository.findById(projectId).orElseThrow(ProjectNotFoundException::new);
		return this.userAccountService.getUserAccountsByProjects(project);
	}
}
