package ca.projectTOMi.tomi.authorization.manager;

import java.util.List;

/**
 * Provides an interface control access to the TOMi system using the policy based access control
 * lists.
 *
 * @param <E>
 * 	Policy to be controlled by the manager
 *
 * @author Karol Talbot
 * @version 1
 */
public interface AuthManager<E> {
	/**
	 * Requests access to perform the requested method on the provided uri.
	 *
	 * @param uri
	 * 	the address of the requested object
	 * @param requestMethod
	 * 	the method performed on the requested object
	 *
	 * @return if the request is granted
	 */
	boolean requestAuthorization(String uri, String requestMethod);

	/**
	 * Request inclusion of a link to a requested method on a requested object.
	 *
	 * @param url
	 * 	Location of the object
	 * @param request
	 * 	Requested method to be performed
	 *
	 * @return If the link is permitted
	 */
	boolean linkAuthorization(String url, String request);

	/**
	 * Loads a users policies into the manager.
	 *
	 * @param policies
	 * 	List of policies to be loaded into the manager
	 */
	void loadUserPolicies(List<E> policies);
}
