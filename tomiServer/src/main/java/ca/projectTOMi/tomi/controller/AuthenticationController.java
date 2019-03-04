package ca.projectTOMi.tomi.controller;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.service.UserAuthenticationService;
import com.google.api.client.googleapis.auth.oauth2.GooglePublicKeysManager;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
/**
 * @author Karol Talbot
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class AuthenticationController {
	private final static String CLIENT_ID_1 = "730191725836-os1al23f91okt57uactu0renuordqo1c.apps.googleusercontent.com";
	private final static String CLIENT_ID_2 = "730191725836-6pv3tlbl520hai1tnl96nr0du79b7sfp.apps.googleusercontent.com";
	private static GooglePublicKeysManager googlePublicKeysManager;
	private final UserAuthenticationService userAuthenticationService;

	@Autowired
	public AuthenticationController(UserAuthenticationService userAuthenticationService) {
		this.userAuthenticationService = userAuthenticationService;
	}

	@PostMapping ("/tokensignin")
	public Boolean getToken(@RequestBody String idtoken) throws IOException, GeneralSecurityException {
		UserAccount account = null;
		try {
			 account = this.userAuthenticationService.checkLogin(idtoken);
		}catch (Exception e){
			System.out.println(e);
		}
		return account != null;
	}
}
