package ca.projectTOMi.tomi.authorization.policy.id;

import java.io.Serializable;
import ca.projectTOMi.tomi.authorization.permission.UserPermission;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;
/**
 * @author Karol Talbot
 */
@Data
public class UserAuthId implements Serializable {
	private Long requestingUser;
	private UserPermission permission;
}
