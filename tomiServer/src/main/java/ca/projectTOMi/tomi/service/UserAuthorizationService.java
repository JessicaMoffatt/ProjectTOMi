package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.authorization.permission.UserPermission;
import ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.UserAuthorizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link UserAuthorizationPolicy} objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Service
public class UserAuthorizationService {
	/**
	 * Permissions granted to every admin account.
	 */
	private static final UserPermission[] ADMIN_PERMISSIONS = new UserPermission[]{
		UserPermission.READ_LISTS,
		UserPermission.CREATE_USER_ACCOUNT,
		UserPermission.DELETE_USER_ACCOUNT,
		UserPermission.READ_USER_ACCOUNT,
		UserPermission.WRITE_USER_ACCOUNT
	};

	/**
	 * Repository for persisting UserAuthorizationPolicy objects
	 */
	private final UserAuthorizationRepository userAuthorizationRepository;

	/**
	 * Creates the UserAuthorizationService.
	 *
	 * @param userAuthorizationRepository
	 * 	Repository for persisting UserAuthorizationPolicy objects
	 */
	@Autowired
	public UserAuthorizationService(final UserAuthorizationRepository userAuthorizationRepository) {
		this.userAuthorizationRepository = userAuthorizationRepository;
	}

	/**
	 * Sets policies when a UserAccount is updated.
	 *
	 * @param updatedUserAccount
	 * 	The UserAccount that was updated.
	 */
	void updatedUserAccount(final UserAccount updatedUserAccount) {
		if (updatedUserAccount.isProgramDirector()) {
			this.userAuthorizationRepository.deleteAll(this.userAuthorizationRepository.getAllByRequestingUser(updatedUserAccount));
			for (final UserPermission p : UserPermission.values()) {
				final UserAuthorizationPolicy authPolicy = new UserAuthorizationPolicy();
				authPolicy.setPermission(p);
				authPolicy.setRequestingUser(updatedUserAccount);
				this.userAuthorizationRepository.save(authPolicy);
			}
		} else if (updatedUserAccount.isAdmin()) {
			this.userAuthorizationRepository.deleteAll(this.userAuthorizationRepository.getAllByRequestingUser(updatedUserAccount));
			for (final UserPermission adminPermission : ADMIN_PERMISSIONS) {
				final UserAuthorizationPolicy authPolicy = new UserAuthorizationPolicy();
				authPolicy.setPermission(adminPermission);
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

	public void setTeamLead(UserAccount teamLead) {
		try {
			final UserAuthorizationPolicy policy = new UserAuthorizationPolicy();
			policy.setRequestingUser(teamLead);
			policy.setPermission(UserPermission.READ_TEAM);
			this.userAuthorizationRepository.save(policy);
		}catch (Exception e){

		}
		try {
			final UserAuthorizationPolicy policy = new UserAuthorizationPolicy();
			policy.setRequestingUser(teamLead);
			policy.setPermission(UserPermission.READ_USER_ACCOUNT);
			userAuthorizationRepository.save(policy);
		}catch (Exception e){

		}
	}
}
