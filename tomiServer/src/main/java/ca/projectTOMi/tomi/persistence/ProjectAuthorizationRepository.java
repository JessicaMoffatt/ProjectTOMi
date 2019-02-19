package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.authorization.ProjectAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectAuthorizationRepository extends JpaRepository<ProjectAuthorizationPolicy, Long> {
  List<ProjectAuthorizationPolicy> getAllByRequestingUser(UserAccount userAccount);
}
