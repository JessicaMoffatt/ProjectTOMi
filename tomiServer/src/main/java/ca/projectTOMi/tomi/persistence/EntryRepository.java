package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * EntryRepository is used to persist and retrieve data regarding {@Link Entry} from the database.
 *
 * @author Iliya Kiritchkov and Karol Talbot
 * @version 1.2
 */
public interface EntryRepository extends JpaRepository<Entry, Long> {

    /**
     * Get all {@Link Entry} objects that have the provided active status.
     *
     * @param active if the Entry is active.
     *
     * @return List containing all Entries with the provided active state.
     */
    public List<Entry> getAllByActiveOrderById(boolean active);

    /**
     * Get all {@Link Entry} objects that are active status and part of the provided {@link Timesheet}.
     *
     * @param timesheet the timesheet containing the entry
     * @return list of entries on the timesheet
     */
    public List<Entry> getAllByActiveTrueAndTimesheetOrderById(Timesheet timesheet);
}
