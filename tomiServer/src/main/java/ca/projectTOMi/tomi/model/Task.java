package ca.projectTOMi.tomi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotBlank;

/**
 * A Task represents a deliverable for the client. Can also be thought of as a phase of
 * development.
 *
 * @author Iliya Kiritchkov
 * @version 1
 */
@Entity
@Data
public final class Task {

	/**
	 * The unique identifier for this Task. Used to distinguish between Tasks.
	 */
	@Id
	@GeneratedValue (generator = "task_sequence")
	@SequenceGenerator (
		name = "task_sequence",
		sequenceName = "task_sequence",
		allocationSize = 1
	)
	private Long id;

	/**
	 * The name of this Task.
	 */
	@Column (unique = true, length = 100)
	@NotBlank
	private String name;

	/**
	 * If this Task is billable.
	 */
	@Column (nullable = false)
	private boolean billable;

	/**
	 * If this Task is active.
	 */
	@JsonIgnore
	@Column (nullable = false)
	private boolean active;
}
