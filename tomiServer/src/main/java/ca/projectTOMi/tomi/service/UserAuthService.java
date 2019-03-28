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
	private static final UserPermission[] ADMIN_PERMISSIONS = new UserPermission[]{
		UserPermission.READ_LISTS,
		UserPermission.CREATE_USER_ACCOUNT,
		UserPermission.DELETE_USER_ACCOUNT,
		UserPermission.READ_USER_ACCOUNT,
		UserPermission.WRITE_USER_ACCOUNT
	};

	private final UserAuthorizationRepository userAuthorizationRepository;

	@Autowired
	public UserAuthService(final UserAuthorizationRepository userAuthorizationRepository) {
		this.userAuthorizationRepository = userAuthorizationRepository;
	}

	public void updatedUserAccount(final UserAccount updatedUserAccount) {
		if (updatedUserAccount.isProgramDirector()) {
			this.userAuthorizationRepository.deleteAll(this.userAuthorizationRepository.getAllByRequestingUser(updatedUserAccount));
			for (UserPermission p : UserPermission.values()) {
				final UserAuthorizationPolicy authPolicy = new UserAuthorizationPolicy();
				authPolicy.setPermission(p);
				authPolicy.setRequestingUser(updatedUserAccount);
				this.userAuthorizationRepository.save(authPolicy);
			}
		} else if (updatedUserAccount.isAdmin()) {
			this.userAuthorizationRepository.deleteAll(this.userAuthorizationRepository.getAllByRequestingUser(updatedUserAccount));
			for (int i = 0; i < ADMIN_PERMISSIONS.length; i++) {
				final UserAuthorizationPolicy authPolicy = new UserAuthorizationPolicy();
				authPolicy.setPermission(ADMIN_PERMISSIONS[i]);
				authPolicy.setRequestingUser(updatedUserAccount);
				this.userAuthorizationRepository.save(authPolicy);
			}
		} else {
			this.userAuthorizationRepository.deleteAll(this.userAuthorizationRepository.getAllByRequestingUser(updatedUserAccount));
			final UserAuthorizationPolicy authPolicy = new UserAuthorizationPolicy();
			authPolicy.setPermission(UserPermission.READ_LISTS);
			authPolicy.setRequestingUser(updatedUserAccount);
			this.userAuthorizationRepository.save(authPolicy);

		}
	}
}
