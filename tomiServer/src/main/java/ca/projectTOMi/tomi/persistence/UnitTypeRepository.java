package ca.projectTOMi.tomi.persistence;

import ca.projectTOMi.tomi.model.UnitType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/*
    @author Jessica Moffatt
    @version 1
    UnitTypeRepository is used to persist and retrieve data regarding unit types from the database.
 */
public interface UnitTypeRepository extends JpaRepository<UnitType, Long> {
}
