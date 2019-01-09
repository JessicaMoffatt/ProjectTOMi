package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    public List<Team> getAllByActive(boolean active);
}
