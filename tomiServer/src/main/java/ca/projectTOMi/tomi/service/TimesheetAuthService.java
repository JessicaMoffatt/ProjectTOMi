package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.authorization.permission.TimesheetPermission;
import ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.TimesheetAuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
/**
 * @author Karol Talbot
 */
@Service
public class TimesheetAuthService {
	private final TimesheetAuthRepository timesheetAuthRepository;

	@Autowired
	public TimesheetAuthService(final TimesheetAuthRepository timesheetAuthRepository){
		this.timesheetAuthRepository = timesheetAuthRepository;
	}

	public void setNewUserAccountPolicy(UserAccount newUserAccount){

		TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
		for(TimesheetPermission t: TimesheetPermission.values()) {
			authPolicy.setPermission(t);
			authPolicy.setRequestingUser(newUserAccount);
			authPolicy.setTimesheetOwner(newUserAccount);
			this.timesheetAuthRepository.save(authPolicy);
		}
	}
}
