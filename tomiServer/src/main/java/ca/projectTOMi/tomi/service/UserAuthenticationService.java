package ca.projectTOMi.tomi.service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.UserAccountRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GooglePublicKeysManager;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserAuthenticationService {
	private final static String CLIENT_ID_1 = "730191725836-os1al23f91okt57uactu0renuordqo1c.apps.googleusercontent.com";
	private final static String CLIENT_ID_2 = "730191725836-6pv3tlbl520hai1tnl96nr0du79b7sfp.apps.googleusercontent.com";
	private static GooglePublicKeysManager googlePublicKeysManager;
	private final UserAccountRepository userAccountRepository;

	@Autowired
	public UserAuthenticationService(final UserAccountRepository userAccountRepository) {
		this.userAccountRepository = userAccountRepository;
		try {
			googlePublicKeysManager = new GooglePublicKeysManager(GoogleNetHttpTransport.newTrustedTransport(), JacksonFactory.getDefaultInstance());
		} catch (IOException | GeneralSecurityException e) {

		}
	}

	public UserAccount checkLogin(final String idToken) throws Exception{
		final GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(UserAuthenticationService.googlePublicKeysManager)
			.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2))
			.build();
		final GoogleIdToken gIdToken = verifier.verify(idToken);

		UserAccount account = null;
		if (gIdToken != null) {
			final GoogleIdToken.Payload payload = gIdToken.getPayload();
			String userId = payload.getSubject();
			account = this.userAccountRepository.getByActiveTrueAndGoogleId(userId);
			if(account == null){
				final String email = payload.getEmail();
				account = this.userAccountRepository.getByActiveTrueAndEmail(email);
				if(account == null){
					return null;
				}
				account.setGoogleId(userId);
				this.userAccountRepository.save(account);
			}
		}
		return account;
	}
}
