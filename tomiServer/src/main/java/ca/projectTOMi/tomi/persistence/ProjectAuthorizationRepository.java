package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.authorization.policy.id.ProjectAuthId;
import ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectAuthorizationRepository extends JpaRepository<ProjectAuthorizationPolicy, ProjectAuthId> {
  List<ProjectAuthorizationPolicy> getAllByRequestingUser(UserAccount userAccount);
}
