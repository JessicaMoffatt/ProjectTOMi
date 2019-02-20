package ca.projectTOMi.tomi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

/**
 * A Unit Type is used to distinguish between types of units.
 *
 * @author Jessica Moffatt and Iliya Kiritchkov
 * @version 1.2
 */
@Entity
@Data
public final class UnitType {

	/**
	 * The unique identifier of this Unit Type. Used to distinguish between Unit Types.
	 */
	@Id
	@GeneratedValue (generator = "unit_type_sequence")
	@SequenceGenerator (
		name = "unit_type_sequence",
		sequenceName = "unit_type_sequence",
		allocationSize = 1
	)
	private Long id;

	/**
	 * The name of this Unit Type.
	 */
	@NotBlank
	@Column (unique = true)
	private String name;

	/**
	 * The unit of measurement for this Unit Type.
	 */
	@NotBlank
	private String unit;

	/**
	 * The measurement of value of for this Unit Type.
	 */
	@Column (nullable = false)
	@Min (0)
	private double weight;

	/**
	 * Represents whether or not this Unit Type is active.
	 */
	@JsonIgnore
	@Column (nullable = false)
	private boolean active;
}
