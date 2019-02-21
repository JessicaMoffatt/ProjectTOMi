package ca.projectTOMi.tomi.authorization;

import java.io.Serializable;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

@Data
public class ProjectAuthId implements Serializable {
	private UserAccount requestingUser;
	private ProjectPermission permission;
	private Project project;
}
