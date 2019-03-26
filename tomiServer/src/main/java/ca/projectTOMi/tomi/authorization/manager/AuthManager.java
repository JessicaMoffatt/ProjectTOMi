package ca.projectTOMi.tomi.authorization.manager;

import java.util.List;
/**
 * @author Karol Talbot
 */
public interface AuthManager<E> {
	boolean requestAuthorization(String uri, String requestMethod);

	boolean linkAuthorization(String url, String request);

	void loadUserPolicies(List<E> policies);
}
