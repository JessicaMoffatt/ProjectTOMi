package ca.projectTOMi.tomi.authorization.policy;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.ManyToOne;
import ca.projectTOMi.tomi.authorization.policy.id.UserAuthId;
import ca.projectTOMi.tomi.authorization.permission.UserPermission;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

/**
 * The intersection of a UserAccount, and Permission that is used to control access to many
 * operations performed in the TOMi system.
 *
 * @author Karol Talbot
 * @version 1
 */
@Data
@Entity
@IdClass (UserAuthId.class)
public class UserAuthorizationPolicy {

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
	private UserPermission permission;

	@Override
	public int hashCode() {
		return this.requestingUser.hashCode() + this.permission.hashCode();
	}

	@Override
	public boolean equals(final Object obj) {
		if (obj.getClass() != UserAuthorizationPolicy.class) {
			return false;
		} else {
			final UserAuthorizationPolicy policyB = (UserAuthorizationPolicy) obj;
			return this.permission == policyB.getPermission() && this.requestingUser.equals(policyB.getRequestingUser());
		}
	}
}
