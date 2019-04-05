package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.authorization.policy.id.TimesheetAuthId;
import ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 * @author Karol Talbot
 */
public interface TimesheetAuthorizationRepository extends JpaRepository<TimesheetAuthorizationPolicy, TimesheetAuthId> {
	List<TimesheetAuthorizationPolicy> getAllByRequestingUser(UserAccount userAccount);
}
