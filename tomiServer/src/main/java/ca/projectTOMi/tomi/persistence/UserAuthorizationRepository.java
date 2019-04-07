package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.authorization.policy.id.UserAuthId;
import ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * UserAuthorizationRepository is responsible for persisting and retrieving {@link
 * UserAuthorizationPolicy} objects to the database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface UserAuthorizationRepository extends JpaRepository<UserAuthorizationPolicy, UserAuthId> {
	/**
	 * Gets a list of all the UserAuthorizationPolicy objects for the provided UserAccount.
	 *
	 * @param userAccount
	 * 	The requesting UserAccount
	 *
	 * @return List of all UserAuthorizationPolicy objects for the provided UserAccount
	 */
	List<UserAuthorizationPolicy> getAllByRequestingUser(UserAccount userAccount);
}
