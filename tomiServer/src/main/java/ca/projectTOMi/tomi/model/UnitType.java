package ca.projectTOMi.tomi.model;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/*
    A unit type is used to distinguish between types of units.
 */
@Entity
@Data
public class UnitType {

    /*
        The unique identifier of this unit type.
     */
    @Id
    @GeneratedValue(generator = "unit_type_sequence")
    @SequenceGenerator(
            name = "unit_type_sequence",
            sequenceName = "unit_type_sequence",
            allocationSize = 1
    )
    private Long id;

    /*
        The name of this unit type.
     */
    @NotBlank
    @Column(unique=true)
    private String name;

    /*
        The unit of measurement for this unit type.
     */
    @NotBlank
    private String unit;

    /*
        The worth of what was produced.
     */
    @NotNull
    private double weight;

    /*
        Represents whether or not this unit type is billable.
     */
    @NotNull
    private boolean billable;
}
