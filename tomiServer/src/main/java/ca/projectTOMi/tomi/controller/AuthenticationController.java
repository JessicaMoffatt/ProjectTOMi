package ca.projectTOMi.tomi.controller;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import com.google.api.client.googleapis.auth.oauth2.GooglePublicKeysManager;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;

@RestController
public class AuthenticationController {
	private final static String CLIENT_ID_1 = "730191725836-os1al23f91okt57uactu0renuordqo1c.apps.googleusercontent.com";
	private final static String CLIENT_ID_2= " 730191725836-6pv3tlbl520hai1tnl96nr0du79b7sfp.apps.googleusercontent.com ";

	@PostMapping("/tokensignin")
	public String[] getToken(@RequestParam String idtoken) throws IOException, GeneralSecurityException {
		final String[] results = new String[2];

		final GooglePublicKeysManager googlePublicKeysManager = new GooglePublicKeysManager(GoogleNetHttpTransport.newTrustedTransport(), JacksonFactory.getDefaultInstance());
		final GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(googlePublicKeysManager)
			.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2))
			.build();

		final GoogleIdToken idToken = verifier.verify(idtoken);

		if (idToken != null) {
			final Payload payload = idToken.getPayload();

			String userId = payload.getSubject();

			// Get profile information from payload
			String email = payload.getEmail();
			boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
			String name = (String) payload.get("name");
			String pictureUrl = (String) payload.get("picture");
			String locale = (String) payload.get("locale");
			String familyName = (String) payload.get("family_name");
			String givenName = (String) payload.get("given_name");

			results[0] = name;
			results[1] = pictureUrl;

		} else {
			System.out.println("Invalid ID token.");
		}


		return results;
	}
}
