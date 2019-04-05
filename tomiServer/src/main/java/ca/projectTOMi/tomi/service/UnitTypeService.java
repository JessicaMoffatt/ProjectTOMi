package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.exception.UnitTypeNotFoundException;
import ca.projectTOMi.tomi.model.UnitType;
import ca.projectTOMi.tomi.persistence.UnitTypeRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

/**
 * Provides services for {@link UnitType} objects.
 *
 * @author Iliya Kiritchkov
 * @author Karol Talbot
 * @version 1
 */
@Service
public final class UnitTypeService {
	private final UnitTypeRepository repository;

	/**
	 * Constructor for the UnitTypeService component
	 *
	 * @param repository
	 * 	Repository responsible for persisting {@link UnitType} instances.
	 */
	public UnitTypeService(final UnitTypeRepository repository) {
		this.repository = repository;
	}

	/**
	 * Updates the @{Link UnitType} object with the provided attributes.
	 *
	 * @param id
	 * 	The unique identifier for the UnitType to update.
	 * @param newUnitType
	 * 	UnitType object containing the updated attributes.
	 *
	 * @return UnitType containing the updated attributes.
	 */
	public UnitType updateUnitType(final Long id, final UnitType newUnitType) {
		return this.repository.findById(id).map(unitType -> {
			unitType.setName(newUnitType.getName());
			unitType.setUnit(newUnitType.getUnit());
			unitType.setWeight(newUnitType.getWeight());
			unitType.setActive(true);
			return this.repository.save(unitType);
		}).orElseThrow(UnitTypeNotFoundException::new);
	}

	/**
	 * Gets a {@link UnitType} object with the provided id.
	 *
	 * @param id
	 * 	The unique identifier for the UnitType to find.
	 *
	 * @return UnitType object matching the provided id.
	 */
	public UnitType getUnitType(final Long id) {
		return this.repository.findById(id).orElseThrow(UnitTypeNotFoundException::new);
	}

	/**
	 * Gets a list of all {@link UnitType} objects that are active.
	 *
	 * @return List containing all UnitTypes that are active.
	 */
	public List<UnitType> getActiveUnitTypes() {
		return this.repository.getAllByActiveOrderById(true);
	}

	/**
	 * Persists the provided @{Link UnitType}.
	 *
	 * @param unitType
	 * 	UnitType to be persisted.
	 *
	 * @return the UnitType that was persisted.
	 */
	public UnitType createUnitType(final UnitType unitType) {
		UnitType unitTypeToSave = this.repository.findByName(unitType.getName());
		unitTypeToSave = unitTypeToSave == null ? new UnitType() : unitTypeToSave;
		unitTypeToSave.setActive(true);
		unitTypeToSave.setUnit(unitType.getUnit());
		unitTypeToSave.setWeight(unitType.getWeight());
		unitTypeToSave.setName(unitType.getName());
		return this.repository.save(unitTypeToSave);
	}

	public UnitType deleteUnitType(final UnitType unitType) {
		unitType.setActive(false);
		return this.repository.save(unitType);
	}
}
