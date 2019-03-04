package ca.projectTOMi.tomi.authorization.policy.id;

import java.io.Serializable;
import ca.projectTOMi.tomi.authorization.permission.ProjectPermission;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;
/**
 * @author Karol Talbot
 */
@Data
public class ProjectAuthId implements Serializable {
	private Long requestingUser;
	private ProjectPermission permission;
	private String project;
}
