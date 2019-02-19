package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.authorization.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimesheetAuthorizationRepository extends JpaRepository<TimesheetAuthorizationPolicy, Long> {
  List<TimesheetAuthorizationPolicy> getAllByRequestingUser(UserAccount userAccount);
}
