package ca.projectTOMi.tomi.authorization.policy.id;

import java.io.Serializable;
import ca.projectTOMi.tomi.authorization.permission.UserPermission;
import lombok.Data;

/**
 * Unique identifier for UserAuthorizationPolicy objects in the database.
 *
 * @author Karol Talbot
 * @version 1
 */
@Data
public class UserAuthId implements Serializable {
	/**
	 * The id of the requesting UserAccount for the policy.
	 */
	private Long requestingUser;

	/**
	 * The permission for the policy.
	 */
	private UserPermission permission;
}
