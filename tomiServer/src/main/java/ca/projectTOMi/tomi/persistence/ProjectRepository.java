package ca.projectTOMi.tomi.persistence;

import java.util.List;
import java.util.Optional;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * ProjectRepository is used to persist and retrieve data regarding {@link Project} from the
 * database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface ProjectRepository extends JpaRepository<Project, String> {
	/**
	 * Gets a list of project identifiers with the provided prefix.
	 *
	 * @param prefix
	 * 	The prefix to search for
	 *
	 * @return List of strings representing the project ids
	 */
	@Query ("SELECT id FROM Project WHERE id LIKE CONCAT('%',:prefix,'%') ORDER BY id DESC")
	List<String> getIds(@Param ("prefix") String prefix);

	/**
	 * Get all {@link Project}s that have the provided active status.
	 *
	 * @param active
	 * 	if the Project is active
	 *
	 * @return List containing all Projects with the provided active state
	 */
	List<Project> getAllByActiveOrderById(boolean active);

	/**
	 * Gets all active Projects where the provided UserAccount is a member of the project.
	 *
	 * @param user
	 * 	The UserAccount to get projects for.
	 *
	 * @return List containing all active projects the provided UserAccount is a member of
	 */
	List<Project> getAllByActiveTrueAndProjectMembersContainsOrderById(UserAccount user);

	/**
	 * Finds the first active project where the provided UserAccount is the project manager.
	 *
	 * @param projectManager
	 * 	The UserAccount to search for as project manager
	 *
	 * @return the first project containing the UserAccount as the project manager
	 */
	Optional<Project> findFirstByActiveTrueAndProjectManager(UserAccount projectManager);
}
