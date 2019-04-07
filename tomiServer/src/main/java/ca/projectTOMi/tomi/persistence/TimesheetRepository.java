package ca.projectTOMi.tomi.persistence;

import java.time.LocalDate;
import java.util.List;
import ca.projectTOMi.tomi.model.Status;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * TimesheetRepository is used to persist and retrieve data regarding {@link Timesheet} from the
 * database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {

	/**
	 * Get all {@link Timesheet}s that have the provided active status.
	 *
	 * @param active
	 * 	if the timesheet is active
	 *
	 * @return List containing all accounts with the provided active state
	 */
	List<Timesheet> getAllByActiveOrderById(boolean active);


	/**
	 * Gets all the {@link Status} of all active {@link ca.projectTOMi.tomi.model.Entry}s associated
	 * with a provided {@link Timesheet}.
	 *
	 * @param timesheetId
	 * 	the unique identifier for the timesheet
	 *
	 * @return List of Status for entries on the timesheet
	 */
	@Query ("SELECT status FROM Entry WHERE timesheet.id = :timesheetId AND active = true ")
	List<Status> getEntriesStatusesByTimesheet(@Param ("timesheetId") Long timesheetId);

	List<Timesheet> getAllByActiveTrueAndUserAccountOrderByStartDateDesc(UserAccount userAccount);

	List<Timesheet> getAllByActiveTrueAndStartDate(LocalDate date);
}
