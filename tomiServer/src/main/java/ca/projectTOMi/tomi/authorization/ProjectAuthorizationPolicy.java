package ca.projectTOMi.tomi.authorization;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

@Data
@Entity
public class ProjectAuthorizationPolicy {
	@Id
	@GeneratedValue (generator = "project_auth_sequence")
	@SequenceGenerator (
		name = "project_auth_sequence",
		sequenceName = "project_auth_sequence",
		allocationSize = 1
	)
	private Long id;

	@ManyToOne (targetEntity = UserAccount.class, optional = false)
	private UserAccount requestingUser;

	@Enumerated
	@NotNull
	private ProjectPermission permission;

	@ManyToOne (targetEntity = Project.class, optional = false)
	private Project project;

	@Override
	public String toString() {
		return String.format("%10S%45S%20S%n", this.requestingUser.getFirstName(), this.project.getProjectName(), this.permission.name());
	}

	@Override
	public int hashCode() {
		return this.id.hashCode();
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
