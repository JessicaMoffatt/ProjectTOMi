package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.model.UnitType;
import ca.projectTOMi.tomi.persistence.UnitTypeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
    UnitTypeController is used to control the flow of data regarding unit types to/from the view.
 */
@RestController
public class UnitTypeController {
    /*
        The repository for the UnitType class.
     */
    UnitTypeRepository repository;

    public UnitTypeController(UnitTypeRepository repository){
        this.repository = repository;
    }

    @PostMapping("/unitTypes")
    public UnitType createUnitType(@RequestBody UnitType unitType){
        return repository.save(unitType);
    }

    @PutMapping("/unitTypes/{id}")
    public UnitType updateUnitType(@RequestBody UnitType newUnitType, @PathVariable Long id){
        UnitType updatedUnitType = repository.findById(id).map(unitType -> {
            unitType.setName(newUnitType.getName());
            unitType.setBillable(newUnitType.isBillable());
            unitType.setUnit(newUnitType.getUnit());
            unitType.setWeight(newUnitType.getWeight());

            return repository.save(unitType);
        }).orElseGet(()->{
            newUnitType.setId(id);
            return repository.save(newUnitType);
        });
        return updatedUnitType;
    }

    @GetMapping("/unitTypes")
    public List<UnitType> all(){
        return repository.findAll();
    }

    @GetMapping("/unitTypes/{unitTypeId}")
    public UnitType getUnitType(@PathVariable Long unitTypeId){
        UnitType unitType = repository.findById(unitTypeId).orElseThrow(()-> new RuntimeException() );
        return unitType;
    }

//    @DeleteMapping("/unitType/unitTypeId")
//    public UnitType deleteUnitType(@PathVariable Long unitTypeId){
//        return repository.delete();
//    }

    public UnitType getUnitTypeById(Long unitTypeId){
        UnitType unitType = repository.findById(unitTypeId).get();
        return unitType;
    }
}
