package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.model.Team;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * UserAccountRepository is used to persist and retrieve data regarding {@link UserAccount} from the
 * database.
 *
 * @author Karol Talbot
 * @version 2
 */
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
  /**
   * Get all {@link UserAccount}s that have the provided active status.
   *
   * @param active
   *   if the {@link UserAccount} is active
   *
   * @return List containing all accounts with the provided active state
   */
  public List<UserAccount> getAllByActiveOrderById(boolean active);

  /**
   * Gets all {@ling UserAccount}s that are a part of the provided {@link Team}.
   *
   * @param team
   *   the team to get UserAccounts for
   *
   * @return List containing all UserAccounts that are a part of the provided team
   */
  public List<UserAccount> getUserAccountsByTeamOrderById(Team team);

  /**
   * Gets all Active UserAccounts that are not a part of a Team.
   *
   * @return List of UserAccount that do not belong to a Team
   */
  public List<UserAccount> getAllByActiveTrueAndTeamIsNullOrderById();
}
