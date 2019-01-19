package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Account;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.persistence.NamedQuery;
import java.util.List;

/**
 * EntryRepository is used to persist and retrieve data regarding {@Link Entry} from the database.
 *
 * @author Iliya Kiritchkov
 * @version 1.1
 */
public interface EntryRepository extends JpaRepository<Entry, Long> {

    /**
     * Get all {@Like Entry} objects that belong to the provided {@Link Account}.
     * @param account the Account to get Entries for.
     * @return List containing all Entries belonging to the Account.
     */
    @Query (value = "SELECT id FROM Entry WHERE account = ?1")
    public List<Entry> getEntriesByAccount(Account account);

    /**
     * Get all {@Link Entry} objects that belong to the provided {@Link Project}.
     * @param project the Project to get Entries for.
     * @return List containing all Entries belonging to the Project.
     */
    @Query (value = "SELECT id FROM Entry WHERE project = ?1")
    public List<Entry> getEntriesByProject(Project project);

}
