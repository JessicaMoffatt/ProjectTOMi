package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * EntryRepository is used to persist and retrieve data regarding {@Link Entry} from the database.
 *
 * @author Iliya Kiritchkov
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
    public List<Entry> getActiveEntries(boolean active);
}
