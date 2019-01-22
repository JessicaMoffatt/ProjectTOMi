package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * ProjectRepository is used to persist and retrieve data regarding {@link Project} from the database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface ProjectRepository extends JpaRepository<Project, String> {
//  @Query ("SELECT projectId FROM Project WHERE projectId LIKE %?1")
//  public String getIds(String prefix);

}
