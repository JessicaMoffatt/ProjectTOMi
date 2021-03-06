package ca.projectTOMi.tomi.authorization.manager;

import java.util.List;

/**
 * Provides an interface to ensure all objects in a list are present in the policies of the
 * requesting user.
 *
 * @param <E>
 * 	Object to be filtered.
 */
public interface AuthorizationFilter<E> {
	/**
	 * Removes items from a list that a UserAccount does not have permission to view.
	 *
	 * @param list
	 * 	list of E to be filtered
	 *
	 * @return List of filtered Items
	 */
	List<E> filterList(List<E> list);

	/**
	 * Filters fields from an object E that a UserAccount does not have permission to view.
	 *
	 * @param toFilter
	 * 	E to be filtered
	 *
	 * @return filtered item E
	 */
	E filterFields(E toFilter);
}
