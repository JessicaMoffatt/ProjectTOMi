package ca.projectTOMi.tomi.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.UserAccountResourceAssembler;
import ca.projectTOMi.tomi.authorization.manager.UserAuthManager;
import ca.projectTOMi.tomi.authorization.wrapper.UserAuthLinkWrapper;
import ca.projectTOMi.tomi.exception.MinimumAdminAccountException;
import ca.projectTOMi.tomi.exception.MinimumProgramDirectorAccountException;
import ca.projectTOMi.tomi.exception.TeamNotFoundException;
import ca.projectTOMi.tomi.exception.UserAccountNotFoundException;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.service.UserAccountService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rest Controller that handles HTTP requests for {@link UserAccount} objects in the TOMi system.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class UserAccountController {
	/**
	 * Converts UserAccounts into HATEOAS Resources.
	 */
	private final UserAccountResourceAssembler assembler;

	/**
	 * Provides services for maintaining UserAccounts.
	 */
	private final UserAccountService userAccountService;

	/**
	 * Provides access to the system logs for error reporting.
	 */
	private final Logger logger = LoggerFactory.getLogger("UserAccount Controller");

	/**
	 * Creates the UserAccountController.
	 *
	 * @param assembler
	 * 	Converts UserAccounts into Resources
	 * @param userAccountService
	 * 	Provides services required for maintaining UserAccounts
	 */
	@Autowired
	public UserAccountController(final UserAccountResourceAssembler assembler,
	                             final UserAccountService userAccountService) {
		this.assembler = assembler;
		this.userAccountService = userAccountService;
	}

	/**
	 * Returns a resource representing the requested {@link UserAccount} to the source of a GET
	 * request to /accounts/id.
	 *
	 * @param id
	 * 	unique identifier for the UserAccount
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Resource representing the UserAccount object.
	 */
	@GetMapping ("/user_accounts/{id}")
	public Resource<UserAccount> getAccount(@PathVariable final Long id,
	                                        @RequestAttribute final UserAuthManager authMan) {
		final UserAccount userAccount = this.userAccountService.getUserAccount(id);

		return this.assembler.toResource(new UserAuthLinkWrapper<>(userAccount, authMan));
	}

	/**
	 * Returns a collection of all active accounts the source of a GET request to /accounts.
	 *
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Collection of resources representing all active accounts
	 */
	@GetMapping ("/user_accounts")
	public Resources<Resource<UserAccount>> getActiveAccounts(@RequestAttribute final UserAuthManager authMan) {
		final List<Resource<UserAccount>> accountList = this.userAccountService.getActiveUserAccounts()
			.stream()
			.map(userAccount -> new UserAuthLinkWrapper<>(userAccount, authMan))
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(accountList,
			linkTo(methodOn(UserAccountController.class).getActiveAccounts(authMan)).withSelfRel());
	}

	/**
	 * Returns a collection of all accounts associated with a given team.
	 *
	 * @param teamId
	 * 	unique identifier for the team to be retrieved
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return Collection of resources representing all active accounts on a team
	 */
	@GetMapping ("/teams/{teamId}/user_accounts")
	public Resources<Resource<UserAccount>> getAccountsByTeam(@PathVariable final Long teamId,
	                                                          @RequestAttribute final UserAuthManager authMan) {
		final List<Resource<UserAccount>> accountList = this.userAccountService.getUserAccountsByTeam(teamId)
			.stream()
			.map(userAccount -> new UserAuthLinkWrapper<>(userAccount, authMan))
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(accountList,
			linkTo(methodOn(UserAccountController.class).getAccountsByTeam(teamId, authMan)).withSelfRel());
	}

	/**
	 * Creates a new {@link UserAccount} with the attributes provided in the POST request to
	 * /accounts.
	 *
	 * @param newUserAccount
	 * 	a userAccount object with required information.
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return the newly created UserAccount
	 *
	 * @throws URISyntaxException
	 * 	When the created URI is unable to be parsed
	 */
	@PostMapping ("/user_accounts")
	public ResponseEntity<?> createUserAccount(@RequestBody final UserAccount newUserAccount,
	                                           @RequestAttribute final UserAuthManager authMan) throws URISyntaxException {
		final Resource<UserAccount> resource = this.assembler.toResource(new UserAuthLinkWrapper<>(this.userAccountService.createUserAccount(newUserAccount), authMan));

		return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
	}

	/**
	 * Updates the attributes for a {@link UserAccount} with the provided id with the attributes
	 * provided in the PUT request to /accounts/id.
	 *
	 * @param id
	 * 	the unique identifier for the UserAccount to be updated
	 * @param newUserAccount
	 * 	the updated userAccount
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return the updated userAccount
	 */
	@PutMapping ("/user_accounts/{id}")
	public Resource<UserAccount> updateUserAccount(@PathVariable final Long id,
	                                               @RequestBody final UserAccount newUserAccount,
	                                               @RequestAttribute final UserAuthManager authMan) {
		final UserAccount updatedUserAccount = this.userAccountService.updateUserAccount(id, newUserAccount);

		return this.assembler.toResource(new UserAuthLinkWrapper<>(updatedUserAccount, authMan));
	}

	/**
	 * Sets the requested userAccount's active attribute false, removing it from the list of active
	 * accounts. Responds to the DELETE requests to /accounts/id.
	 *
	 * @param id
	 * 	the unique identifier for the userAccount to be set inactive
	 *
	 * @return a response without any content
	 */
	@DeleteMapping ("/user_accounts/{id}")
	public ResponseEntity<?> setUserAccountInactive(@PathVariable final Long id) {
		final UserAccount userAccount = this.userAccountService.getUserAccount(id);
		this.userAccountService.deleteUserAccount(userAccount);

		return ResponseEntity.noContent().build();
	}

	/**
	 * Gets the {@link UserAccount} for a {@link ca.projectTOMi.tomi.model.Team}'s leader.
	 *
	 * @param teamId
	 * 	the unique identifier for the Team
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return the team lead's UserAccount
	 */
	@GetMapping ("/teams/{teamId}/team_lead")
	public Resource<UserAccount> getTeamLead(@PathVariable final Long teamId,
	                                         @RequestAttribute final UserAuthManager authMan) {
		return this.assembler.toResource(new UserAuthLinkWrapper<>(this.userAccountService.getTeamLead(teamId), authMan));
	}

	/**
	 * Gets {@link UserAccount}s that are active but not a part of {@link
	 * ca.projectTOMi.tomi.model.Team}.
	 *
	 * @param authMan
	 * 	AuthorizationManager for the requesting user
	 *
	 * @return List of UserAccounts that are active, but not a part of any team
	 */
	@GetMapping ("/teams/unassigned")
	public Resources<Resource<UserAccount>> getUnassignedUserAccounts(@RequestAttribute final UserAuthManager authMan) {
		final List<Resource<UserAccount>> available = this.userAccountService.getUnassignedUserAccounts()
			.stream()
			.map(userAccount -> new UserAuthLinkWrapper<>(userAccount, authMan))
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(available,
			linkTo(methodOn(UserAccountController.class).getUnassignedUserAccounts(authMan)).withSelfRel());
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
	@ExceptionHandler ({UserAccountNotFoundException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("UserAccount Exception: " + e.getClass());

		return ResponseEntity.status(400).build();
	}

	/**
	 * Informs the client that performing the requested action would result in less than the minimum
	 * amount of admin accounts or program director accounts.
	 *
	 * @param e
	 * 	The exception that had occurred
	 *
	 * @return An unprocessableEntity Response
	 */
	@ExceptionHandler ({MinimumProgramDirectorAccountException.class, MinimumAdminAccountException.class, TeamNotFoundException.class})
	public ResponseEntity<?> handleMinimumAccountExceptions(final Exception e) {
		this.logger.warn("UserAccount Exception: " + e.getClass());

		return ResponseEntity.unprocessableEntity().build();
	}
}
