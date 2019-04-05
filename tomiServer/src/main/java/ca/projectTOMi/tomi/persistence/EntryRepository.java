package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.Status;
import ca.projectTOMi.tomi.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * EntryRepository is used to persist and retrieve data regarding {@link Entry} from the database.
 *
 * @author Iliya Kiritchkov
 * @author Karol Talbot
 * @version 1.2
 */
public interface EntryRepository extends JpaRepository<Entry, Long> {

	/**
	 * Get all {@link Entry} objects that have the provided active status.
	 *
	 * @param active
	 * 	if the Entry is active.
	 *
	 * @return List containing all Entries with the provided active state.
	 */
	List<Entry> getAllByActiveOrderById(boolean active);

	/**
	 * Get all {@link Entry} objects that are active status and part of the provided {@link
	 * Timesheet}.
	 *
	 * @param timesheet
	 * 	the timesheet containing the entry
	 *
	 * @return list of entries on the timesheet
	 */
	List<Entry> getAllByActiveTrueAndTimesheetOrderById(Timesheet timesheet);

	List<Entry> getAllByActiveTrueAndProjectAndStatus(Project project, Status status);

	List<Entry> getAllByActiveTrueAndProject(Project project);
}
