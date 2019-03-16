package ca.projectTOMi.tomi.authorization.manager;

import java.util.List;
/**
 * @param <E>
 *
 * @author Karol Talbot
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
