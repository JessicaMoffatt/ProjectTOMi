package ca.projectTOMi.tomi.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.SequenceGenerator;
import lombok.Data;

/**
 * A model class for storing information related to the Client.
 *
 * @author Karol Talbot and Iliya Kiritchkov
 * @version 1.1
 */

@Entity
@Data
public final class Client {
	/**
	 * The unique identifier for this Client.
	 */
	@Id
	@GeneratedValue (generator = "client_sequence")
	@SequenceGenerator (
		name = "client_sequence",
		sequenceName = "client_sequence",
		allocationSize = 1
	)
	private Long id;

	/**
	 * The name of this Client.
	 */
	@Column (unique = true, length = 100, nullable = false)
	private String name;

	/**
	 * If this Client is active.
	 */
	@Column (nullable = false)
	private boolean active;
}

