package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Account;
import ca.projectTOMi.tomi.model.Team;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * AccountRepository is used to persist and retrieve data regarding {@link Account} from the
 * database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface AccountRepository extends JpaRepository<Account, Long> {
  public List<Account> getAllByActive(boolean active);

  public List<Account> getAccountsByTeam(Team team);
}
