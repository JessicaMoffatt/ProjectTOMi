package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * ProjectRepository is used to persist and retrieve data regarding {@link Project} from the database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface ProjectRepository extends JpaRepository<Project, String>{
  @Query ("SELECT id FROM Project WHERE id LIKE CONCAT('%',:prefix,'%') ORDER BY id DESC")
  public List<String> getIds(@Param ("prefix") String prefix);

  /**
   * Get all {@link Project}s that have the provided active status.
   *
   * @param active
   *   if the Project is active
   *
   * @return List containing all Projects with the provided active state
   */
  public List<Project> getAllByActive(boolean active);

  public List<Project> getAllByActiveTrueAndProjectMembersContains(UserAccount user);
}
