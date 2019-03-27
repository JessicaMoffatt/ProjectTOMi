package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.authorization.policy.id.UserAuthId;
import ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 * @author Karol Talbot
 */
public interface UserAuthorizationRepository extends JpaRepository<UserAuthorizationPolicy, UserAuthId> {
	List<UserAuthorizationPolicy> getAllByRequestingUser(UserAccount userAccount);
}
