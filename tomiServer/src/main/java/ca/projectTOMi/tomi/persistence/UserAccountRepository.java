package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.model.Team;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
	 * 	if the {@link UserAccount} is active
	 *
	 * @return List containing all accounts with the provided active state
	 */
	List<UserAccount> getAllByActiveOrderById(boolean active);

	/**
	 * Gets all {@link UserAccount}s that are a part of the provided {@link Team}.
	 *
	 * @param team
	 * 	the team to get UserAccounts for
	 *
	 * @return List containing all UserAccounts that are a part of the provided team
	 */
	List<UserAccount> getUserAccountsByTeamOrderById(Team team);

	/**
	 * Gets all Active UserAccounts that are not a part of a Team.
	 *
	 * @return List of UserAccount that do not belong to a Team
	 */
	List<UserAccount> getAllByActiveTrueAndTeamIsNullOrderById();
	List<UserAccount> getAllByActiveTrueAndTeamNot(Team team);

	@Query ("SELECT count(id) FROM UserAccount WHERE admin = true")
	int getAdminCount();

	@Query ("SELECT count(id) FROM UserAccount WHERE programDirector = true")
	int getDirectorCount();

	List<UserAccount> getAllByActiveTrueAndProgramDirectorTrue();

	UserAccount getByActiveTrueAndGoogleId(String id);
	UserAccount getByActiveTrueAndEmail(String email);

	Optional<UserAccount> findByEmail(String email);
}
