package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * ClientRepository is used to persist and retrieve data regarding {@link Client} from the database.
 *
 * @author Karol Talbot
 * @version 1
 */
public interface ClientRepository extends JpaRepository<Client, Long> {
}
