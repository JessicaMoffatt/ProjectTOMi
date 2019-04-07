package ca.projectTOMi.tomi.controller;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;
import ca.projectTOMi.tomi.authorization.manager.UserAuthManager;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.service.UserAuthenticationService;
import com.google.api.client.googleapis.auth.oauth2.GooglePublicKeysManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rest controller for handling requests involving authentication and signing in.
 *
 * @author Karol Talbot
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class AuthenticationController {

	/**
	 * Services for authenticating users.
	 */
	private final UserAuthenticationService userAuthenticationService;

	/**
	 * Provides access to the system logs for reporting errors.
	 */
	private final Logger logger = LoggerFactory.getLogger("Authentication Controller");


	/**
	 * Creates the UserAuthenticationService.
	 *
	 * @param userAuthenticationService
	 * 	Provides services related to user authentication
	 */
	@Autowired
	public AuthenticationController(final UserAuthenticationService userAuthenticationService) {
		this.userAuthenticationService = userAuthenticationService;
	}

	/**
	 * Gets the UserAccount associated with the Google user that owns the token.
	 *
	 * @param idtoken
	 * 	String containing encrypted Google user information
	 *
	 * @return UserAccount associated with the id token
	 *
	 * @throws GeneralSecurityException
	 * 	When a problem occurs with the GooglePublicKeysManager
	 * @throws IOException
	 * 	When bad stuff happens
	 */
	@PostMapping ("/tokensignin")
	public UserAccount getToken(@RequestBody final String idtoken) throws IOException, GeneralSecurityException {
		UserAccount account;
		account = this.userAuthenticationService.checkLogin(idtoken);
		return account;
	}

	/**
	 * Handles requests to generate the top nav bar for the client hiding options that would not be
	 * able to be processed by the server.
	 *
	 * @param signIn
	 * @param authMan
	 *
	 * @return
	 *
	 * @throws GeneralSecurityException
	 * 	When a problem occurs with the GooglePublicKeysManager
	 * @throws IOException
	 * 	When bad stuff happens
	 */
	@GetMapping ("/build_nav_bar")
	public Map<String, Boolean> getNavBarOptions(final @RequestHeader String signIn,
	                                             final @RequestAttribute UserAuthManager authMan) throws GeneralSecurityException, IOException {

		return this.userAuthenticationService.getNavBarOptions(authMan, signIn);
	}

	/**
	 * Informs the client that an exception has occurred. In order to keep the server inner workings
	 * private a generic 400 bad request is used.
	 *
	 * @param e
	 * 	The exception that had occurred
	 *
	 * @return A 400 Bad Request Response
	 */
	@ExceptionHandler ({IOException.class, GeneralSecurityException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Authentication Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}
