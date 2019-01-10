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
  public List<Team> getAllByActive(boolean active);
}
