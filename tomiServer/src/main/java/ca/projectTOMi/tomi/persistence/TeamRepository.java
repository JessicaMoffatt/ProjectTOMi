package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * TeamRepository is used to persist and retrieve data regarding {@link Team} from the database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface TeamRepository extends JpaRepository<Team, Long> {
  /**
   * Get all {@link Team}s that have the provided active status.
   *
   * @param active
   *   if the {@link Team} is active
   *
   * @return List containing all teams with the provided active state
   */
  public List<Team> getAllByActive(boolean active);
}
