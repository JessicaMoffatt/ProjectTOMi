package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.authorization.manager.TimesheetAuthManager;
import ca.projectTOMi.tomi.authorization.permission.TimesheetPermission;
import ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.TimesheetAuthorizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
/**
 * @author Karol Talbot
 */
@Service
public class TimesheetAuthService {
	private final TimesheetAuthorizationRepository timesheetAuthorizationRepository;

	@Autowired
	public TimesheetAuthService(final TimesheetAuthorizationRepository timesheetAuthorizationRepository){
		this.timesheetAuthorizationRepository = timesheetAuthorizationRepository;
	}

	public void setNewUserAccountPolicy(UserAccount newUserAccount){

		TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
		for(TimesheetPermission t: TimesheetPermission.values()) {
			authPolicy.setPermission(t);
			authPolicy.setRequestingUser(newUserAccount);
			authPolicy.setTimesheetOwner(newUserAccount);
			this.timesheetAuthorizationRepository.save(authPolicy);
		}
	}
}
