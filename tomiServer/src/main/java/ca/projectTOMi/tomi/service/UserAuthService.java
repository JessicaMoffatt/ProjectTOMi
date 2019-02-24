package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.authorization.permission.UserPermission;
import ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.UserAuthorizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Karol Talbot
 */
@Service
public class UserAuthService {
	private final UserAuthorizationRepository userAuthorizationRepository;

	@Autowired
	public UserAuthService(final UserAuthorizationRepository userAuthorizationRepository){
		this.userAuthorizationRepository = userAuthorizationRepository;
	}

	public void setNewUserAccountPolicy(UserAccount newUserAccount){

		UserAuthorizationPolicy authPolicy = new UserAuthorizationPolicy();
		authPolicy.setPermission(UserPermission.READ_LISTS);
		authPolicy.setRequestingUser(newUserAccount);
		this.userAuthorizationRepository.save(authPolicy);
	}
}
