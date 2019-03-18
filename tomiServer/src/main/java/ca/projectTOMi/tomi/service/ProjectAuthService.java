package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.authorization.permission.ProjectPermission;
import ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy;
import ca.projectTOMi.tomi.exception.UserAccountNotFoundException;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.ProjectAuthorizationRepository;
import ca.projectTOMi.tomi.persistence.ProjectRepository;
import ca.projectTOMi.tomi.persistence.TeamRepository;
import ca.projectTOMi.tomi.persistence.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Karol Talbot
 */
@Service
public class ProjectAuthService {
	final private static ProjectPermission[] PROJECT_MANAGER_PERMISSION = new ProjectPermission[]{
		ProjectPermission.EVALUATE_ENTRIES,
		ProjectPermission.READ,
		ProjectPermission.CREATE_EXPENSE,
		ProjectPermission.DELETE_EXPENSE,
		ProjectPermission.WRITE
	};

	final private ProjectAuthorizationRepository projectAuthorizationRepository;
	final private UserAccountRepository userAccountRepository;
	final private ProjectRepository projectRepository;
	final private TeamRepository teamRepository;

	@Autowired
	public ProjectAuthService(final ProjectAuthorizationRepository projectAuthorizationRepository,
	                          final UserAccountRepository userAccountRepository,
	                          final ProjectRepository projectRepository,
	                          final TeamRepository teamRepository) {
		this.projectAuthorizationRepository = projectAuthorizationRepository;
		this.userAccountRepository = userAccountRepository;
		this.projectRepository = projectRepository;
		this.teamRepository = teamRepository;
	}

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

	void changeProjectManager(final Project oldProject, final Project newProject) {
		if (oldProject == null || newProject == null){
			return;
		}else if (oldProject.getProjectManager() != null && (newProject.getProjectManager() == null || !oldProject.getProjectManager().equals(newProject.getProjectManager()))) {
			final UserAccount oldProjectManager = oldProject.getProjectManager();
			final ProjectAuthorizationPolicy policy = new ProjectAuthorizationPolicy();
			policy.setProject(newProject);
			policy.setRequestingUser(oldProjectManager);
			if (!oldProjectManager.isProgramDirector()) {
				for (final ProjectPermission permission : ProjectAuthService.PROJECT_MANAGER_PERMISSION) {
					policy.setPermission(permission);
					this.projectAuthorizationRepository.delete(policy);
				}
			}
		} else if (newProject.getProjectManager() != null && (oldProject.getProjectManager() == null || !oldProject.getProjectManager().equals(newProject.getProjectManager()))) {
			final UserAccount newProjectManager = newProject.getProjectManager();
			final ProjectAuthorizationPolicy policy = new ProjectAuthorizationPolicy();
			policy.setProject(newProject);
			policy.setRequestingUser(newProjectManager);
			for (final ProjectPermission permission : ProjectAuthService.PROJECT_MANAGER_PERMISSION) {
				policy.setPermission(permission);
				this.projectAuthorizationRepository.save(policy);
			}
		}
	}

	void addProjectMember(final UserAccount userAccount, final Project project) {
		final ProjectAuthorizationPolicy policy = new ProjectAuthorizationPolicy();
		policy.setPermission(ProjectPermission.READ);
		policy.setProject(project);
		policy.setRequestingUser(userAccount);
		this.projectAuthorizationRepository.save(policy);
	}
}

