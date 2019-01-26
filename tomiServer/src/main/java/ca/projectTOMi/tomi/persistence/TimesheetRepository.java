package ca.projectTOMi.tomi.persistence;

import java.util.List;
import ca.projectTOMi.tomi.model.Status;
import ca.projectTOMi.tomi.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author Karol Talbot
 * @version 1
 */
public interface TimesheetRepository  extends JpaRepository<Timesheet, Long> {
  public List<Timesheet> getAllByActive(boolean active);


  @Query("SELECT status FROM Entry WHERE timesheet.id = :timesheetId AND active = true ")
  public List<Status> getEntriesStatusesByTimesheet(@Param("timesheetId") Long timesheetId);
}
