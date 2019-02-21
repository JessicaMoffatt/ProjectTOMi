package ca.projectTOMi.tomi.authorization.policy.id;

import java.io.Serializable;
import ca.projectTOMi.tomi.authorization.permission.UserPermission;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

@Data
public class UserAuthId implements Serializable {
	private UserAccount requestingUser;
	private UserPermission permission;
}
