package ca.projectTOMi.tomi.authorization.policy.id;

import java.io.Serializable;
import ca.projectTOMi.tomi.authorization.permission.TimesheetPermission;
import lombok.Data;

/**
 * Unique identifier for TimesheetAuthorizationPolicy objects in the database.
 *
 * @author Karol Talbot
 * @version 1
 */
@Data
public class TimesheetAuthId implements Serializable {
	/**
	 * The id of the requesting UserAccount for the policy.
	 */
	private Long requestingUser;

	/**
	 * The permission for the policy.
	 */
	private TimesheetPermission permission;

	/**
	 * The id of the owner UserAccount of the object associated with the policy.
	 */
	private Long timesheetOwner;
}
