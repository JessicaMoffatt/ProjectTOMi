package ca.projectTOMi.tomi.persistence;

import java.util.List;
import java.util.Optional;
import ca.projectTOMi.tomi.authorization.permission.ProjectPermission;
import ca.projectTOMi.tomi.authorization.policy.id.ProjectAuthId;
import ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 * @author Karol Talbot
 */
public interface ProjectAuthorizationRepository extends JpaRepository<ProjectAuthorizationPolicy, ProjectAuthId> {
	Optional<List<ProjectAuthorizationPolicy>> findAllByRequestingUser(UserAccount userAccount);

	List<ProjectAuthorizationPolicy> getAllByRequestingUserAndAndPermission(UserAccount userAccount, ProjectPermission permission);
}
