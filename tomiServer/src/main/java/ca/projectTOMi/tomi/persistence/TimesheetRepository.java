package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimesheetRepository  extends JpaRepository<Timesheet, Long> {
}
