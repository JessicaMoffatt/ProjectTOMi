package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.authorization.policy.id.TimesheetAuthId;
import ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 * TimesheetAuthorizationRepository is responsible for persisting and retrieving {@link
 * TimesheetAuthorizationPolicy} objects to the database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface TimesheetAuthorizationRepository extends JpaRepository<TimesheetAuthorizationPolicy, TimesheetAuthId> {
	/**
	 * Gets a list of all the TimesheetAuthorizationPolicy objects for the provided UserAccount.
	 *
	 * @param userAccount
	 * 	The requesting UserAccount
	 *
	 * @return List of all TimesheetAuthorizationPolicy objects for the provided UserAccount
	 */
	List<TimesheetAuthorizationPolicy> getAllByRequestingUser(UserAccount userAccount);
}
