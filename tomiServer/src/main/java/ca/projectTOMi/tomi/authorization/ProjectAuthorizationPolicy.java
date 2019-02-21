package ca.projectTOMi.tomi.authorization;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.ManyToOne;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

@Data
@Entity
@IdClass(ProjectAuthId.class)
public class ProjectAuthorizationPolicy {
	@Id
	@ManyToOne (targetEntity = UserAccount.class, optional = false)
	private UserAccount requestingUser;

	@Id
	@Enumerated
	private ProjectPermission permission;

	@Id
	@ManyToOne (targetEntity = Project.class, optional = false)
	private Project project;

	@Override
	public String toString() {
		return String.format("%10S%45S%20S%n", this.requestingUser.getFirstName(), this.project.getProjectName(), this.permission.name());
	}

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
}
