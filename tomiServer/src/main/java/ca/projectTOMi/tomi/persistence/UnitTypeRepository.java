package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.UnitType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * UnitTypeRepository is used to persist and retrieve data regarding {@link UnitType} from the
 * database.
 *
 * @author Karol Talbot
 * @author Iliya Kiritchkov
 * @version 1.2
 */
@Repository
public interface UnitTypeRepository extends JpaRepository<UnitType, Long> {

	/**
	 * Gets the list of {@link UnitType} by active status.
	 *
	 * @param active
	 * 	if the UnitType is active.
	 *
	 * @return The list of UnitTypes by active status.
	 */
	List<UnitType> getAllByActiveOrderById(boolean active);

	/**
	 * Finds a UnitType with the provided name.
	 *
	 * @param name
	 * 	The name of the UnitType to be found
	 *
	 * @return The UnitType with the provided name
	 */
	UnitType findByName(String name);
}
