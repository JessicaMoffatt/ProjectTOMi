package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

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
	 * 	if the {@link Team} is active
	 *
	 * @return List containing all teams with the provided active state
	 */
	List<Team> getAllByActiveOrderById(boolean active);

	/**
	 * Finds the first active Team where the provided UserAccount is team lead.
	 *
	 * @param teamLead
	 * 	The UserAccount to find as team lead
	 *
	 * @return Team the UserAccount is team lead of
	 */
	Optional<Team> findFirstByActiveTrueAndTeamLead(UserAccount teamLead);
}
