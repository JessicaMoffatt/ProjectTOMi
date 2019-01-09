package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Account;
import ca.projectTOMi.tomi.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    public List<Account> getAccountsByTeam(Team team);
}
