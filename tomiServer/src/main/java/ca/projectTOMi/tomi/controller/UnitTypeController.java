package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.assembler.UnitTypeResourceAssembler;
import ca.projectTOMi.tomi.model.UnitType;
import ca.projectTOMi.tomi.persistence.UnitTypeRepository;
import ca.projectTOMi.tomi.service.UnitTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Handles HTTP requests for {@Link UnitType} objects in the ProjectTOMi system.
 *
 * @author Karol Talbot (updated by Iliya Kiritchkov)
 * @version 1.1
 */
@RestController
public class UnitTypeController {
    UnitTypeResourceAssembler assembler;
    UnitTypeService service;

    /**
     * Constructor for this UnitTypeController.
     *
     * @param assembler Converts {@Link UnitType} objects into resources.
     * @param service   Provides services required for UnitType objects.
     */
    public UnitTypeController(UnitTypeResourceAssembler assembler, UnitTypeService service) {
        this.assembler = assembler;
        this.service = service;
    }

    @PostMapping("/unitTypes")
    public UnitType createUnitType(@RequestBody UnitType unitType) {
        return repository.save(unitType);
    }

    @PutMapping("/unitTypes/{id}")
    public UnitType updateUnitType(@RequestBody UnitType newUnitType, @PathVariable Long id) {
        UnitType updatedUnitType = repository.findById(id).map(unitType -> {
            unitType.setName(newUnitType.getName());
            unitType.setBillable(newUnitType.isBillable());
            unitType.setUnit(newUnitType.getUnit());
            unitType.setWeight(newUnitType.getWeight());

            return repository.save(unitType);
        }).orElseGet(() -> {
            newUnitType.setId(id);
            return repository.save(newUnitType);
        });
        return updatedUnitType;
    }

    @GetMapping("/unitTypes")
    public List<UnitType> all() {
        return repository.findAll();
    }

    @GetMapping("/unitTypes/{unitTypeId}")
    public UnitType getUnitType(@PathVariable Long unitTypeId) {
        UnitType unitType = repository.findById(unitTypeId).orElseThrow(() -> new RuntimeException());
        return unitType;
    }

//    @DeleteMapping("/unitType/unitTypeId")
//    public UnitType deleteUnitType(@PathVariable Long unitTypeId){
//        return repository.delete();
//    }

    public UnitType getUnitTypeById(Long unitTypeId) {
        UnitType unitType = repository.findById(unitTypeId).get();
        return unitType;
    }
}
