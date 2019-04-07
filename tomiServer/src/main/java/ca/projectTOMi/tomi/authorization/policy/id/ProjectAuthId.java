package ca.projectTOMi.tomi.authorization.policy.id;

import java.io.Serializable;
import ca.projectTOMi.tomi.authorization.permission.ProjectPermission;
import lombok.Data;

/**
 * Unique identifier for ProjectAuthorizationPolicy objects in the database.
 *
 * @author Karol Talbot
 * @version 1
 */
@Data
public class ProjectAuthId implements Serializable {
	/**
	 * The id of the requesting UserAccount for the policy.
	 */
	private Long requestingUser;

	/**
	 * The permission for the policy.
	 */
	private ProjectPermission permission;

	/**
	 * The project for the policy.
	 */
	private String project;
}
