package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * EntryRepository is used to persist and retrieve data regarding {@Link Entry} from the database.
 *
 * @author Iliya Kiritchkov
 * @version 1.1
 */
public interface EntryRepository extends JpaRepository<Entry, Long> {

}
