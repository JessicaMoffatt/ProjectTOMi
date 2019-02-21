package ca.projectTOMi.tomi.authorization.manager;

import java.util.List;
import ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy;
import ca.projectTOMi.tomi.authorization.permission.ProjectPermission;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;


public final class ProjectAuthorizationManager implements AuthorizationManager<ProjectAuthorizationPolicy>, AuthorizationFilter<Project> {
	private List<ProjectAuthorizationPolicy> policies;
	private final UserAccount user;

	public ProjectAuthorizationManager(final UserAccount user) {
		this.user = user;
	}

	@Override
	public boolean requestAuthorization(final String URI, final String request) {
		final ProjectAuthorizationPolicy requestPolicy = new ProjectAuthorizationPolicy();
		requestPolicy.setRequestingUser(this.user);
		final Project requestProject;
		if ("POST".equals(request)) {
			requestPolicy.setPermission(ProjectPermission.CREATE_EXPENSE);
			requestProject = new Project();
			requestProject.setId(URI.split("/")[2]);
			requestPolicy.setProject(requestProject);
		} else if ("PUT".equals(request)) {
			if ("entries".equals(URI.split("/")[3])) {
				requestPolicy.setPermission(ProjectPermission.EVALUATE_ENTRIES);
			} else {
				requestPolicy.setPermission(ProjectPermission.WRITE);
			}
			requestProject = new Project();
			requestProject.setId(URI.split("/")[2]);
			requestPolicy.setProject(requestProject);
		} else if ("DELETE".equals(request)) {
			requestPolicy.setPermission(ProjectPermission.DELETE_EXPENSE);
			requestProject = new Project();
			requestProject.setId(URI.split("/")[2]);
			requestPolicy.setProject(requestProject);
		} else if ("GET".equals(request)) {
			try {
				if ("evaluate_entries".equals(URI.split("/")[3])) {
					requestPolicy.setPermission(ProjectPermission.EVALUATE_ENTRIES);
				} else if ("user_accounts".equals(URI.split("/")[1])) {
					return handleListReads();
				} else {
					requestPolicy.setPermission(ProjectPermission.READ);
				}
				requestProject = new Project();
				requestProject.setId(URI.split("/")[2]);
				requestPolicy.setProject(requestProject);
			} catch (final IndexOutOfBoundsException e) {
				return handleListReads();
			}
		}
		return this.policies.contains(requestPolicy);
	}

	private boolean handleListReads() {
		boolean hasAnyReadPermission = false;
		for (final ProjectAuthorizationPolicy policy : this.policies) {
			final boolean hasReadPermission = policy.getPermission() == ProjectPermission.READ;
			hasAnyReadPermission = Boolean.logicalOr(hasAnyReadPermission, hasReadPermission);
		}
		return hasAnyReadPermission;
	}

	@Override
	public boolean linkAuthorization(final String URI, final String request) {
		return false;
	}

	@Override
	public void loadUserPolicies(final List<ProjectAuthorizationPolicy> policies) {
		this.policies = policies;
	}


	@Override
	public List<Project> filterList(final List<Project> list) {
		return null;
	}

	@Override
	public Project filterFields(final Project toFilter) {
		return null;
	}
}
