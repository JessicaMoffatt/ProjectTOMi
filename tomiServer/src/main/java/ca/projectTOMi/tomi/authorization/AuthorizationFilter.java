package ca.projectTOMi.tomi.authorization;

import java.util.List;
public interface AuthorizationFilter<E> {
  /**
   * Removes items from a list that a UserAccount does not have permission to view.
   *
   * @param list
   *   list of E to be filtered
   *
   * @return List of filtered Items
   */
  public List<E> filterList(List<E> list);

  /**
   * Filters fields from an object E that a UserAccount does not have permission to view.
   *
   * @param toFilter
   *   E to be filtered
   *
   * @return filtered item E
   */
  public E filterFields(E toFilter);
}
