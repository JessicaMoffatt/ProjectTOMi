package ca.projectTOMi.tomi.authorization;

import java.io.Serializable;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

@Data
public class TimesheetAuthId implements Serializable {
	private UserAccount requestingUser;
	private TimesheetPermission permission;
	private UserAccount timesheetOwner;
}
