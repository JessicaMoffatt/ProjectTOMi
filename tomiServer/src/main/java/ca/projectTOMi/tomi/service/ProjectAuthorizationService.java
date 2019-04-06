package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.authorization.permission.ProjectPermission;
import ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.ProjectAuthorizationRepository;
import ca.projectTOMi.tomi.persistence.ProjectRepository;
import ca.projectTOMi.tomi.persistence.TeamRepository;
import ca.projectTOMi.tomi.persistence.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
/**
 * Provides services for {@link ProjectAuthorizationPolicy} objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Service
public class ProjectAuthorizationService {

	/**
	 * Project permissions granted to project managers.
	 */
	final private static ProjectPermission[] PROJECT_MANAGER_PERMISSION = new ProjectPermission[]{
		ProjectPermission.EVALUATE_ENTRIES,
		ProjectPermission.READ,
		ProjectPermission.CREATE_EXPENSE,
		ProjectPermission.DELETE_EXPENSE,
		ProjectPermission.WRITE,
		ProjectPermission.READ_BUDGET
	};

	/**
	 * Repository for persisting ProjectAuthorizationPolicy objects
	 */
	final private ProjectAuthorizationRepository projectAuthorizationRepository;

	/**
	 * Repository for UserAccounts.
	 */
	final private UserAccountRepository userAccountRepository;

	/**
	 * Repository for Projects.
	 */
	final private ProjectRepository projectRepository;

	/**
	 * Repository for Teams.
	 */
	final private TeamRepository teamRepository;

	/**
	 * Constructor for the ProjectAuthorizationService.
	 *
	 * @param projectAuthorizationRepository
	 * 	Repository for persisting ProjectAuthorizationPolicy objects
	 * @param userAccountRepository
	 * 	Repository for UserAccounts
	 * @param projectRepository
	 * 	Repository for Projects
	 * @param teamRepository
	 * 	Repository for Teams
	 */
	@Autowired
	public ProjectAuthorizationService(final ProjectAuthorizationRepository projectAuthorizationRepository,
	                                   final UserAccountRepository userAccountRepository,
	                                   final ProjectRepository projectRepository,
	                                   final TeamRepository teamRepository) {
		this.projectAuthorizationRepository = projectAuthorizationRepository;
		this.userAccountRepository = userAccountRepository;
		this.projectRepository = projectRepository;
		this.teamRepository = teamRepository;
	}

	/**
	 * Sets policies for a new program director.
	 *
	 * @param newDirector
	 * 	the UserAccount of the new director
	 */
	void newProgramDirector(final UserAccount newDirector) {
		final List<Project> allProjects = this.projectRepository.findAll();
		final ProjectAuthorizationPolicy policy = new ProjectAuthorizationPolicy();
		policy.setRequestingUser(newDirector);
		for (final Project project : allProjects) {
			policy.setProject(project);
			for (final ProjectPermission permission : ProjectPermission.values()) {
				policy.setPermission(permission);
				this.projectAuthorizationRepository.save(policy);
			}
		}
	}

	/**
	 * Removes policies from a UserAccount that is no longer a program director.
	 *
	 * @param oldDirector
	 * 	The UserAccount to remove policies from
	 */
	void removeProgramDirector(final UserAccount oldDirector) {
		final List<Project> allProjects = this.projectRepository.findAll();
		final ProjectAuthorizationPolicy policy = new ProjectAuthorizationPolicy();
		policy.setRequestingUser(oldDirector);
		for (final Project project : allProjects) {
			policy.setProject(project);
			for (final ProjectPermission permission : ProjectPermission.values()) {
				policy.setPermission(permission);
				if (policy.getPermission() != ProjectPermission.READ || !policy.getProject().getProjectMembers().contains(oldDirector)) {
					this.projectAuthorizationRepository.delete(policy);
				}
			}
			if (project.getProjectManager() != null && project.getProjectManager().equals(oldDirector)) {
				final Project temp = new Project();
				this.changeProjectManager(temp, project);
			}
		}
	}

	/**
	 * Adds polices to all program directors when a new project is created.
	 *
	 * @param project
	 * 	The project that was created
	 */
	void newProjectPolicies(final Project project) {
		if (project.getProjectManager() != null) {
			final Project p = new Project();
			this.changeProjectManager(p, project);
		}
		final List<UserAccount> programDirectors = this.userAccountRepository.getAllByActiveTrueAndProgramDirectorTrue();
		for (final UserAccount director : programDirectors) {
			final ProjectAuthorizationPolicy policy = new ProjectAuthorizationPolicy();
			policy.setRequestingUser(director);
			policy.setProject(project);
			for (final ProjectPermission permission : ProjectPermission.values()) {
				policy.setPermission(permission);
				this.projectAuthorizationRepository.save(policy);
			}
		}
	}

	/**
	 * Changes the policies when a project manager is changed for the project.
	 *
	 * @param oldProject
	 * 	the project before changing managers
	 * @param newProject
	 * 	the project after changing managers
	 */
	void changeProjectManager(final Project oldProject, final Project newProject) {
		if (oldProject == null || newProject == null){
			return;
		} else if (oldProject.getProjectManager() != null && (newProject.getProjectManager() == null || !oldProject.getProjectManager().equals(newProject.getProjectManager()))) {
			final UserAccount oldProjectManager = oldProject.getProjectManager();
			final ProjectAuthorizationPolicy policy = new ProjectAuthorizationPolicy();
			policy.setProject(newProject);
			policy.setRequestingUser(oldProjectManager);
			if (!oldProjectManager.isProgramDirector()) {
				for (final ProjectPermission permission : ProjectAuthorizationService.PROJECT_MANAGER_PERMISSION) {
					policy.setPermission(permission);
					this.projectAuthorizationRepository.delete(policy);
				}
			}
		} else if (newProject.getProjectManager() != null && (oldProject.getProjectManager() == null || !oldProject.getProjectManager().equals(newProject.getProjectManager()))) {
			final UserAccount newProjectManager = newProject.getProjectManager();
			final ProjectAuthorizationPolicy policy = new ProjectAuthorizationPolicy();
			policy.setProject(newProject);
			policy.setRequestingUser(newProjectManager);
			for (final ProjectPermission permission : ProjectAuthorizationService.PROJECT_MANAGER_PERMISSION) {
				policy.setPermission(permission);
				this.projectAuthorizationRepository.save(policy);
			}
		}
	}

	/**
	 * Sets policies for a UserAccount when they are added to a project.
	 *
	 * @param userAccount
	 * 	The UserAccount added to the Project
	 * @param project
	 * 	The project the user was added to
	 */
	void addProjectMember(final UserAccount userAccount, final Project project) {
		final ProjectAuthorizationPolicy policy = new ProjectAuthorizationPolicy();
		policy.setPermission(ProjectPermission.READ);
		policy.setProject(project);
		policy.setRequestingUser(userAccount);
		this.projectAuthorizationRepository.save(policy);
	}
}

