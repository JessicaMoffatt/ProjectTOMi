package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Karol Talbot
 * @version 1
 */
public interface TimesheetRepository  extends JpaRepository<Timesheet, Long> {
  public List<Timesheet> getAllByActive(boolean active);
}
