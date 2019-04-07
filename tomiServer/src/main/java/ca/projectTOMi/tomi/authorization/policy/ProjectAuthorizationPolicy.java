package ca.projectTOMi.tomi.authorization.policy;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.ManyToOne;
import ca.projectTOMi.tomi.authorization.policy.id.ProjectAuthId;
import ca.projectTOMi.tomi.authorization.permission.ProjectPermission;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

/**
 * The intersection of a UserAccount, Permission, and Project that is used to control access to
 * operations performed on {@link Project} objects in the TOMi system.
 *
 * @author Karol Talbot
 * @version 1
 */
@Data
@Entity
@IdClass (ProjectAuthId.class)
public class ProjectAuthorizationPolicy {
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
	private ProjectPermission permission;

	/**
	 * The project the operation is being performed on.
	 */
	@Id
	@ManyToOne (targetEntity = Project.class, optional = false)
	private Project project;

	@Override
	public int hashCode() {
		return this.project.hashCode() + this.permission.hashCode();
	}

	@Override
	public boolean equals(final Object obj) {
		if (obj.getClass() != ProjectAuthorizationPolicy.class) {
			return false;
		} else {
			final ProjectAuthorizationPolicy policyB = (ProjectAuthorizationPolicy) obj;
			return this.permission == policyB.getPermission() && this.project.equals(policyB.getProject()) && this.requestingUser.equals(policyB.getRequestingUser());
		}
	}

	@Override
	public String toString() {
		return String.format("%10S%45S%20S%n", this.requestingUser.getFirstName(), this.project.getProjectName(), this.permission.name());
	}
}
