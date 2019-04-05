package ca.projectTOMi.tomi.service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import ca.projectTOMi.tomi.authorization.manager.UserAuthManager;
import ca.projectTOMi.tomi.authorization.permission.UserPermission;
import ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.ProjectRepository;
import ca.projectTOMi.tomi.persistence.TeamRepository;
import ca.projectTOMi.tomi.persistence.UserAccountRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GooglePublicKeysManager;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Karol Talbot
 */
@Service
public class UserAuthenticationService {
	private final static String CLIENT_ID_1 = "730191725836-os1al23f91okt57uactu0renuordqo1c.apps.googleusercontent.com";
	private final static String CLIENT_ID_2 = "730191725836-6pv3tlbl520hai1tnl96nr0du79b7sfp.apps.googleusercontent.com";
	private static GooglePublicKeysManager googlePublicKeysManager;
	private final UserAccountRepository userAccountRepository;
	private final TeamRepository teamRepository;
	private final ProjectRepository projectRepository;

	@Autowired
	public UserAuthenticationService(final UserAccountRepository userAccountRepository,
	                                 final TeamRepository teamRepository,
	                                 final ProjectRepository projectRepository) {
		this.userAccountRepository = userAccountRepository;
		this.teamRepository = teamRepository;
		this.projectRepository = projectRepository;
		try {
			googlePublicKeysManager = new GooglePublicKeysManager(GoogleNetHttpTransport.newTrustedTransport(), JacksonFactory.getDefaultInstance());
		} catch (IOException | GeneralSecurityException e) {

		}
	}

	public UserAccount checkLogin(final String idToken) throws GeneralSecurityException, IOException {
		final GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(UserAuthenticationService.googlePublicKeysManager)
			.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2))
			.build();
		final GoogleIdToken gIdToken = verifier.verify(idToken);

		UserAccount account = null;
		if (gIdToken != null) {
			final GoogleIdToken.Payload payload = gIdToken.getPayload();
			String userId = payload.getSubject();
			account = this.userAccountRepository.getByActiveTrueAndGoogleId(userId);
			if (account == null) {
				final String email = payload.getEmail();
				account = this.userAccountRepository.getByActiveTrueAndEmail(email);
				if (account == null) {
					return null;
				}
				account.setGoogleId(userId);
				this.userAccountRepository.save(account);
			}
		}
		return account;
	}

	public Map<String, Boolean> getNavBarOptions(final UserAuthManager authMan, String user) throws GeneralSecurityException, IOException {
		Set<UserAuthorizationPolicy> policies = authMan.getPolicies();
		UserAccount userAccount = this.checkLogin(user);
		UserAuthorizationPolicy policy = new UserAuthorizationPolicy();
		policy.setRequestingUser(userAccount);
		Map<String, Boolean> navs = new HashMap<>();
		navs.put("my_timesheets", true);

		Project p = this.projectRepository.findFirstByActiveTrueAndProjectManager(userAccount).orElse(null);
		navs.put("approve_timesheets", p != null);

		Team t = this.teamRepository.findFirstByActiveTrueAndTeamLead(userAccount).orElse(null);
		navs.put("my_team", t != null);

		//
		policy.setPermission(UserPermission.DELETE_PROJECT);
		navs.put("manage_projects", policies.contains(policy));

		policy.setPermission(UserPermission.CREATE_TEAM);
		navs.put("manage_teams", policies.contains(policy));

		policy.setPermission(UserPermission.CREATE_UNIT_TYPE);
		navs.put("manage_unit_types", policies.contains(policy));

		policy.setPermission(UserPermission.CREATE_TASK);
		navs.put("manage_tasks", policies.contains(policy));

		policy.setPermission(UserPermission.CREATE_USER_ACCOUNT);
		navs.put("manage_user_accounts", policies.contains(policy));

		policy.setPermission(UserPermission.CREATE_PROJECT);
		navs.put("create_project", policies.contains(policy));
		return navs;
	}
}
