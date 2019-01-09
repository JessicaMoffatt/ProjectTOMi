package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
