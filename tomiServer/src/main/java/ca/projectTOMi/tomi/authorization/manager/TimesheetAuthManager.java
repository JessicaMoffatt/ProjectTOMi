package ca.projectTOMi.tomi.authorization.manager;

import java.util.HashSet;
import java.util.List;
import ca.projectTOMi.tomi.authorization.permission.TimesheetPermission;
import ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;

/**
 * @author Karol Talbot
 */
public final class TimesheetAuthManager implements AuthManager<TimesheetAuthorizationPolicy> {
	private HashSet<TimesheetAuthorizationPolicy> policies;
	private final UserAccount user;
	private final UserAccount owner;

	public TimesheetAuthManager(final UserAccount user, final UserAccount owner) {
		this.user = user;
		this.owner = owner;
	}

	@Override
	public boolean requestAuthorization(final String uri, final String request) {
		final TimesheetAuthorizationPolicy requestPolicy = new TimesheetAuthorizationPolicy();
		requestPolicy.setRequestingUser(this.user);
		requestPolicy.setTimesheetOwner(this.owner);
		if ("POST".equals(request)) {
			requestPolicy.setPermission(TimesheetPermission.CREATE);
		} else if ("PUT".equals(request)) {
			requestPolicy.setPermission(TimesheetPermission.WRITE);
		} else if ("DELETE".equals(request)) {
			requestPolicy.setPermission(TimesheetPermission.DELETE);
		} else if ("GET".equals(request)) {
			try {
				requestPolicy.setPermission(TimesheetPermission.READ);
			} catch (final IndexOutOfBoundsException e) {
				boolean hasAnyReadPermission = false;
				for (final TimesheetAuthorizationPolicy policy : this.policies) {
					final boolean hasReadPermission = policy.getPermission() == TimesheetPermission.READ;
					hasAnyReadPermission = Boolean.logicalOr(hasAnyReadPermission, hasReadPermission);
				}
				return hasAnyReadPermission;
			}
		} else {
			return true;
		}
		return this.policies.contains(requestPolicy);
	}

	@Override
	public boolean linkAuthorization(final String url, final String request) {
		final String uri = url.substring(url.indexOf("/", 7));
		return requestAuthorization(uri, request);
	}

	@Override
	public void loadUserPolicies(final List<TimesheetAuthorizationPolicy> policies) {
		this.policies = new HashSet<>(policies);
	}
}
