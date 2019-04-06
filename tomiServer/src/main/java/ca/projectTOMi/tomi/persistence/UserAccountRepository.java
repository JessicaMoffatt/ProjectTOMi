package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.model.Team;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

	/**
	 * Gets all active UserAccounts that do not belong to the provided Team.
	 *
	 * @param team
	 * 	The Team the UserAccounts do not belong to
	 *
	 * @return List of UserAccounts that are not a part of the provided Team
	 */
	List<UserAccount> getAllByActiveTrueAndTeamNot(Team team);

	/**
	 * Gets the number of UserAccounts that have admin status.
	 *
	 * @return int representing the number of admin UserAccounts
	 */
	@Query ("SELECT count(id) FROM UserAccount WHERE admin = true")
	int getAdminCount();

	/**
	 * Gets the number of UserAccounts that have program director  status.
	 *
	 * @return int representing the number of program director UserAccounts
	 */
	@Query ("SELECT count(id) FROM UserAccount WHERE programDirector = true")
	int getDirectorCount();

	/**
	 * Gets a list of all active UserAccounts that are program directors.
	 *
	 * @return List of program director UserAccounts
	 */
	List<UserAccount> getAllByActiveTrueAndProgramDirectorTrue();

	/**
	 * Gets the active UserAccount with the provided Google ids.
	 *
	 * @param id
	 * 	The Google account id
	 *
	 * @return The UserAccount with the provided Google id
	 */
	UserAccount getByActiveTrueAndGoogleId(String id);

	/**
	 * Gets the active UserAccount with the provided email.
	 *
	 * @param email
	 * 	The email address
	 *
	 * @return The UserAccount with the provided email address
	 */
	UserAccount getByActiveTrueAndEmail(String email);

	/**
	 * Finds a UserAccount by its email address.
	 *
	 * @param email
	 * 	The email address of the UserAccount
	 *
	 * @return The UserAccount with the email address
	 */
	Optional<UserAccount> findByEmail(String email);

	/**
	 * Gets all active UserAccounts assigned to the provided Project.
	 *
	 * @param project
	 * 	The Project to get UserAccounts from
	 *
	 * @return List of UserAccounts assigned to the Project
	 */
	List<UserAccount> getAllByActiveTrueAndProjectsOrderById(Project project);
}
