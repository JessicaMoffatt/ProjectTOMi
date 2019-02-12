package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.UnitType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * UnitTypeRepository is used to persist and retrieve data regarding {@Link UnitType} from the database.
 *
 * @author Karol Talbot (updated by Iliya Kiritchkov)
 * @version 1.2
 */
@Repository
public interface UnitTypeRepository extends JpaRepository<UnitType, Long> {

    /**
     * Gets the list of {@Link UnitType} by active status.
     *
     * @param active if the UnitType is active.
     * @return The list of UnitTypes by active status.
     */
    public List<UnitType> getAllByActiveOrderById(boolean active);
}
