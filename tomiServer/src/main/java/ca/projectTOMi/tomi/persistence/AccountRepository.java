package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Account;
import ca.projectTOMi.tomi.model.Team;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * AccountRepository is used to persist and retrieve data regarding {@link Account} from the
 * database.
 *
 * @author Karol Talbot
 * @version 2
 */
public interface AccountRepository extends JpaRepository<Account, Long> {
  /**
   * Get all {@link Account}s that have the provided active status.
   *
   * @param active
   *   if the {@link Account} is active
   *
   * @return List containing all accounts with the provided active state
   */
  public List<Account> getAllByActive(boolean active);

  /**
   * Gets all {@ling Account}s that are a part of the provided {@link Team}.
   *
   * @param team
   *   the team to get accounts for
   *
   * @return List containing all accounts that are a part of the provided team
   */
  public List<Account> getAccountsByTeam(Team team);
}
