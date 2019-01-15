package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.exception.UnitTypeNotFoundException;
import ca.projectTOMi.tomi.model.UnitType;
import ca.projectTOMi.tomi.persistence.UnitTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Provides services for {@Link UnitType} objects.
 *
 * @author Iliya Kiritchkov
 * @version 1
 */
@Service
public class UnitTypeService {
    private UnitTypeRepository repository;

    /**
     * Constructor for the UnitTypeService component
     *
     * @param repository Repository responsible for persisting {@Link UnitType} instances.
     */
    public UnitTypeService(UnitTypeRepository repository) {
        this.repository = repository;
    }

    /**
     * Updates the @{Link UnitType} object with the provided attributes.
     *
     * @param id          The unique identifier for the UnitType to update.
     * @param newUnitType UnitType object containing the updated attributes.
     * @return UnitType containing the updated attributes.
     */
    public UnitType updateUnitType(Long id, UnitType newUnitType) {
        return repository.findById(id).map(unitType -> {
            unitType.setName(newUnitType.getName());
            unitType.setUnit(newUnitType.getUnit());
            unitType.setWeight(newUnitType.getWeight());
            unitType.setBillable(newUnitType.isBillable());
            unitType.setActive(newUnitType.isActive());
            return repository.save(unitType);
        }).orElseThrow(() -> new UnitTypeNotFoundException());
    }

    /**
     * Gets a {@Link UnitType} object with the provided id.
     *
     * @param id The unique identifier for the UnitType to find.
     * @return UnitType object matching the provided id.
     */
    public UnitType getUnitType(Long id) {
        return repository.findById(id).orElseThrow(() -> new UnitTypeNotFoundException());
    }

    /**
     * Gets a list of all @{Link UnitType} objects that are active.
     *
     * @return List containing all UnitTypes that are active.
     */
    public List<UnitType> getActiveUnitTypes() {
        return repository.getAllByActive(true).stream().collect(Collectors.toList());
    }

    /**
     * Gets a list of all {@Link UnitType} objects that are active and billable.
     *
     * @return List containing all UnitTypes that are active and billable.
     */
    public List<UnitType> getActiveAndBillableUnitTypes() {
        return repository.getAllByActiveAndBillable(true, true).stream().collect(Collectors.toList());
    }

    /**
     * Gets a list of all {@Link UnitType} objects that are active and non-billable.
     *
     * @return List containing all UnitTypes that are active and non-billable.
     */
    public List<UnitType> getActiveAndNonBillableUnitTypes() {
        return repository.getAllByActiveAndBillable(true, false).stream().collect(Collectors.toList());
    }
}
