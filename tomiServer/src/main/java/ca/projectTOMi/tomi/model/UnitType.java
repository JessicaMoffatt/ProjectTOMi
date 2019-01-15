package ca.projectTOMi.tomi.model;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * A Unit Type is used to distinguish between types of units.
 *
 * @author Karol Talbot (updated by Iliya Kiritchkov)
 * @version 1.1
 */
@Entity
@Data
public class UnitType {

    /**
     * The unique identifier of this Unit Type. Used to distinguish between Unit Types.
     */
    @Id
    @GeneratedValue(generator = "unit_type_sequence")
    @SequenceGenerator(
            name = "unit_type_sequence",
            sequenceName = "unit_type_sequence",
            allocationSize = 1
    )
    private Long id;

    /**
     * The name of this Unit Type.
     */
    @NotBlank
    @Column(unique = true)
    private String name;

    /**
     * The unit of measurement for this Unit Type.
     */
    @NotBlank
    private String unit;

    /**
     * The measurement of value of for this Unit Type.
     */
    @Column(nullable = false)
    @Min(0)
    private double weight;

    /**
     * Represents whether or not this Unit Type is billable.
     */
    @Column(nullable = false)
    private boolean billable;

    /**
     * Represents whether or not this Unit Type is active.
     */
    @Column(nullable = false)
    private boolean active;
}
