package ca.projectTOMi.tomi.authorization.manager;

import java.util.List;
import ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy;
import ca.projectTOMi.tomi.authorization.permission.UserPermission;
import ca.projectTOMi.tomi.model.UserAccount;


public final class UserAuthManager implements AuthManager<UserAuthorizationPolicy> {
	private List<UserAuthorizationPolicy> policies;
	private final UserAccount user;

	public UserAuthManager(final UserAccount user) {
		this.user = user;
	}

	@Override
	public boolean requestAuthorization(final String uri, final String request) {
		final UserAuthorizationPolicy requestPolicy = new UserAuthorizationPolicy();
		requestPolicy.setRequestingUser(this.user);
		final String uriHead = uri.split("/")[1];
		if ("POST".equals(request)) {
			switch (uriHead) {
				case "projects":
					requestPolicy.setPermission(UserPermission.CREATE_PROJECT);
					break;
				case "user_accounts":
					requestPolicy.setPermission(UserPermission.CREATE_USER_ACCOUNT);
					break;
				case "teams":
					requestPolicy.setPermission(UserPermission.CREATE_TEAM);
					break;
				case "tasks":
					requestPolicy.setPermission(UserPermission.CREATE_TASK);
					break;
				case "unit_types":
					requestPolicy.setPermission(UserPermission.CREATE_UNIT_TYPE);
					break;
				case "clients":
					requestPolicy.setPermission(UserPermission.CREATE_CLIENT);
					break;
				default:
					return false;
			}
		} else if ("DELETE".equals(request)) {
			switch (uriHead) {
				case "projects":
					requestPolicy.setPermission(UserPermission.DELETE_PROJECT);
					break;
				case "user_accounts":
					requestPolicy.setPermission(UserPermission.DELETE_USER_ACCOUNT);
					break;
				case "teams":
					requestPolicy.setPermission(UserPermission.DELETE_TEAM);
					break;
				case "tasks":
					requestPolicy.setPermission(UserPermission.DELETE_TASK);
					break;
				case "unit_types":
					requestPolicy.setPermission(UserPermission.DELETE_UNIT_TYPE);
					break;
				case "clients":
					requestPolicy.setPermission(UserPermission.DELETE_CLIENT);
					break;
				default:
					return false;
			}
		} else if ("PUT".equals(request)) {
			switch (uriHead) {
				case "user_accounts":
					requestPolicy.setPermission(UserPermission.WRITE_USER_ACCOUNT);
					break;
				case "teams":
					requestPolicy.setPermission(UserPermission.WRITE_TEAM);
					break;
				case "tasks":
					requestPolicy.setPermission(UserPermission.WRITE_TASK);
					break;
				case "unit_types":
					requestPolicy.setPermission(UserPermission.WRITE_UNIT_TYPE);
					break;
				case "clients":
					requestPolicy.setPermission(UserPermission.WRITE_CLIENT);
					break;
				default:
					return false;
			}
		} else if ("GET".equals(request)) {
			switch (uriHead) {
				case "user_accounts":
					requestPolicy.setPermission(UserPermission.READ_USER_ACCOUNT);
					break;
				case "teams":
					requestPolicy.setPermission(UserPermission.READ_TEAM);
					break;
				case "tasks":
					requestPolicy.setPermission(UserPermission.READ_TASK);
					break;
				case "unit_types":
					requestPolicy.setPermission(UserPermission.READ_UNIT_TYPE);
					break;
				case "clients":
					requestPolicy.setPermission(UserPermission.READ_CLIENT);
					break;
				default:
					return false;
			}
			if (uri.split("/").length < 3) {
				requestPolicy.setPermission(UserPermission.READ_LISTS);
			}
		}
		return this.policies.contains(requestPolicy);
	}

	@Override
	public boolean linkAuthorization(final String url, final String request) {
		final String uri = url.substring(url.indexOf("/", 7));
		return requestAuthorization(uri, request);
	}

	@Override
	public void loadUserPolicies(final List<UserAuthorizationPolicy> policies) {
		this.policies = policies;
	}

	public List<UserAuthorizationPolicy> getPolicies(){
		return this.policies;
	}
}
