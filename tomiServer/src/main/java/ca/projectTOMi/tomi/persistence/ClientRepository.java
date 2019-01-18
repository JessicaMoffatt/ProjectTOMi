package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * ClientRepository is used to persist and retrieve data regarding {@link Client} from the database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface ClientRepository extends JpaRepository<Client, Long> {
  /**
   * Get all {@link Client}s that have the provided active status.
   *
   * @param active
   *   if the Clients are active
   *
   * @return List containing all Clients with the provided active state
   */
  public List<Client> getAllByActive(boolean active);
}
