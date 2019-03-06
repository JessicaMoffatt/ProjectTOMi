package ca.projectTOMi.tomi.controller;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
 * @author Karol Talbot
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class AuthenticationController {
	private final static String CLIENT_ID_1 = "730191725836-os1al23f91okt57uactu0renuordqo1c.apps.googleusercontent.com";
	private final static String CLIENT_ID_2 = "730191725836-6pv3tlbl520hai1tnl96nr0du79b7sfp.apps.googleusercontent.com";
	private static GooglePublicKeysManager googlePublicKeysManager;
	private final UserAuthenticationService userAuthenticationService;
	private final Logger logger = LoggerFactory.getLogger("Authentication Controller");


	@Autowired
	public AuthenticationController(UserAuthenticationService userAuthenticationService) {
		this.userAuthenticationService = userAuthenticationService;
	}

	@PostMapping ("/tokensignin")
	public Boolean getToken(@RequestBody String idtoken) throws IOException, GeneralSecurityException {
		UserAccount account = null;
		account = this.userAuthenticationService.checkLogin(idtoken);
		return account != null;
	}

	@GetMapping("/build_nav_bar")
	public Map<String, Boolean> getNavBarOptions(final @RequestHeader String SignIn, final @RequestAttribute UserAuthManager authMan){
		Map<String, Boolean> navs = new HashMap<>();
		navs.put("my_timesheets", true);
		navs.put("approve_timesheets", true);
		navs.put("my_team", true);
		navs.put("manage_projects", true);
		navs.put("manage_teams", true);
		navs.put("manage_unit_types", true);
		navs.put("manage_tasks", true);
		navs.put("manage_user_accounts", true);

		return navs;
	}

	@ExceptionHandler({IOException.class, GeneralSecurityException.class})
	public ResponseEntity<?> handleExceptions(Exception e){
		this.logger.warn("Authentication Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}
