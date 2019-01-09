package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> {
}
