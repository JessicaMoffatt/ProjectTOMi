package ca.projectTOMi.tomi.service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import com.google.api.client.googleapis.auth.oauth2.GooglePublicKeysManager;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.stereotype.Service;

@Service
public class UserAuthenticationService {
	private final static String CLIENT_ID_1 = "730191725836-os1al23f91okt57uactu0renuordqo1c.apps.googleusercontent.com";
	private final static String CLIENT_ID_2 = "730191725836-6pv3tlbl520hai1tnl96nr0du79b7sfp.apps.googleusercontent.com";
	private static GooglePublicKeysManager googlePublicKeysManager;


	public UserAuthenticationService() {
		try {
			googlePublicKeysManager = new GooglePublicKeysManager(GoogleNetHttpTransport.newTrustedTransport(), JacksonFactory.getDefaultInstance());
		} catch (IOException | GeneralSecurityException e) {

		}
	}
}
