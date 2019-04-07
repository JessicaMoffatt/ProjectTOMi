package ca.projectTOMi.tomi.persistence;

import java.util.List;
import java.util.Optional;
import ca.projectTOMi.tomi.authorization.permission.ProjectPermission;
import ca.projectTOMi.tomi.authorization.policy.id.ProjectAuthId;
import ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 * ProjectAuthorizationRepository is responsible for persisting and retrieving {@link
 * ProjectAuthorizationPolicy} objects to the database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface ProjectAuthorizationRepository extends JpaRepository<ProjectAuthorizationPolicy, ProjectAuthId> {
	/**
	 * Gets a list of all the ProjectAuthorizationPolicy objects for the provided UserAccount.
	 *
	 * @param userAccount
	 * 	The requesting UserAccount
	 *
	 * @return List of all ProjectAuthorizationPolicy objects for the provided UserAccount
	 */
	Optional<List<ProjectAuthorizationPolicy>> findAllByRequestingUser(UserAccount userAccount);

	/**
	 * Gets a list of all ProjectAuthorizationPolicy objects for the provided UserAccount with the
	 * provided permission.
	 *
	 * @param userAccount
	 * 	the requesting UserAccount to search for
	 * @param permission
	 * 	the permission to search for
	 *
	 * @return List containing all matching ProjectAuthorizationPolicy objects
	 */
	List<ProjectAuthorizationPolicy> getAllByRequestingUserAndAndPermission(UserAccount userAccount, ProjectPermission permission);
}
