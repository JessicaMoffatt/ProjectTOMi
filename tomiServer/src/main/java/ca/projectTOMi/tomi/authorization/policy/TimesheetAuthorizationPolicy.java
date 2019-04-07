package ca.projectTOMi.tomi.authorization.policy;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.ManyToOne;
import ca.projectTOMi.tomi.authorization.policy.id.TimesheetAuthId;
import ca.projectTOMi.tomi.authorization.permission.TimesheetPermission;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

/**
 * The intersection of a UserAccount, Permission, and object owner UserAccounts that is used to
 * control access to operations performed on {@link ca.projectTOMi.tomi.model.Entry} and {@link
 * ca.projectTOMi.tomi.model.Timesheet} objects in the TOMi system.
 *
 * @author Karol Talbot
 * @version 1
 */
@Data
@Entity
@IdClass (TimesheetAuthId.class)
public class TimesheetAuthorizationPolicy {
	/**
	 * The UserAccount requesting the operation.
	 */
	@Id
	@ManyToOne (targetEntity = UserAccount.class, optional = false)
	private UserAccount requestingUser;

	/**
	 * The permission for the operation.
	 */
	@Id
	@Enumerated
	private TimesheetPermission permission;
	/**
	 * The UserAccount that owns the object being operated on.
	 */
	@Id
	@ManyToOne (targetEntity = UserAccount.class, optional = false)
	private UserAccount timesheetOwner;

	@Override
	public int hashCode() {
		return this.timesheetOwner.hashCode() + this.permission.hashCode();
	}

	@Override
	public boolean equals(final Object obj) {
		if (obj.getClass() != TimesheetAuthorizationPolicy.class) {
			return false;
		} else {
			final TimesheetAuthorizationPolicy policyB = (TimesheetAuthorizationPolicy) obj;
			return this.permission == policyB.getPermission() && this.timesheetOwner.equals(policyB.getTimesheetOwner()) && this.requestingUser.equals(policyB.getRequestingUser());
		}
	}
}
