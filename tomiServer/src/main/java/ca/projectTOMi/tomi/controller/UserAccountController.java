package ca.projectTOMi.tomi.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.UserAccountResourceAssembler;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Handles HTTP requests for {@link UserAccount} objects in the ProjectTOMi system.
 *
 * @author Karol Talbot
 * @version 1.2
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class UserAccountController {
	private final UserAccountResourceAssembler assembler;
	private final UserAccountService userAccountService;
	private final Logger logger = LoggerFactory.getLogger("UserAccount Controller");

	@Autowired
	public UserAccountController(final UserAccountResourceAssembler assembler, final UserAccountService userAccountService) {
		this.assembler = assembler;
		this.userAccountService = userAccountService;
	}

	/**
	 * Returns a resource representing the requested {@link UserAccount} to the source of a GET
	 * request to /accounts/id.
	 *
	 * @param id
	 * 	unique identifier for the UserAccount
	 *
	 * @return Resource representing the UserAccount object.
	 */
	@GetMapping ("/user_accounts/{id}")
	public Resource<UserAccount> getAccount(@PathVariable final Long id) {
		final UserAccount userAccount = this.userAccountService.getUserAccount(id);

		return this.assembler.toResource(userAccount);
	}

	/**
	 * Returns a collection of all active accounts the source of a GET request to /accounts.
	 *
	 * @return Collection of resources representing all active accounts
	 */
	@GetMapping ("/user_accounts")
	public Resources<Resource<UserAccount>> getActiveAccounts() {
		final List<Resource<UserAccount>> account = this.userAccountService.getActiveUserAccounts()
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(account,
			linkTo(methodOn(UserAccountController.class).getActiveAccounts()).withSelfRel());
	}

	/**
	 * Returns a collection of all accounts associated with a given team.
	 *
	 * @param teamId
	 * 	unique identifier for the team to be retrieved
	 *
	 * @return Collection of resources representing all active accounts on a team
	 */
	@GetMapping ("/teams/{teamId}/user_accounts")
	public Resources<Resource<UserAccount>> getAccountsByTeam(@PathVariable final Long teamId) {
		final List<Resource<UserAccount>> userAccount = this.userAccountService.getUserAccountsByTeam(teamId)
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(userAccount,
			linkTo(methodOn(UserAccountController.class).getAccountsByTeam(teamId)).withSelfRel());
	}

	/**
	 * Creates a new {@link UserAccount} with the attributes provided in the POST request to
	 * /accounts.
	 *
	 * @param newUserAccount
	 * 	a userAccount object with required information.
	 *
	 * @return the newly created UserAccount
	 */
	@PostMapping ("/user_accounts")
	public ResponseEntity<?> createUserAccount(@RequestBody final UserAccount newUserAccount) throws URISyntaxException {
		final Resource<UserAccount> resource = this.assembler.toResource(this.userAccountService.createUserAccount(newUserAccount));

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
	 *
	 * @return the updated userAccount
	 */
	@PutMapping ("/user_accounts/{id}")
	public Resource<UserAccount> updateUserAccount(@PathVariable final Long id, @RequestBody final UserAccount newUserAccount) {
		final UserAccount updatedUserAccount = this.userAccountService.updateUserAccount(id, newUserAccount);

		return this.assembler.toResource(updatedUserAccount);
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
		userAccount.setActive(false);
		this.userAccountService.saveUserAccount(userAccount);

		return ResponseEntity.noContent().build();
	}

	/**
	 * Gets the {@link UserAccount} for a {@link ca.projectTOMi.tomi.model.Team}'s leader.
	 *
	 * @param teamId
	 * 	the unique identifier for the Team
	 *
	 * @return the team lead's UserAccount
	 */
	@GetMapping ("/teams/{teamId}/team_lead")
	public Resource<UserAccount> getTeamLead(@PathVariable final Long teamId) {
		return this.assembler.toResource(this.userAccountService.getTeamLead(teamId));
	}

	/**
	 * Gets the {@link UserAccount}s that are active, not part of the provided Team and not a team
	 * lead of any {@link ca.projectTOMi.tomi.model.Team}.
	 *
	 * @param teamId
	 * 	the unique identifier for the Team
	 *
	 * @return List of UserAccounts that are active, not part of the provided Team and not a team lead
	 * of any Teams.
	 */
	@GetMapping ("/teams/{teamId}/available")
	public Resources<Resource<UserAccount>> getAvailableUserAccountsForTeam(@PathVariable final Long teamId) {
		final List<Resource<UserAccount>> userAccount = this.userAccountService.getAvailableUserAccountsForTeam(teamId)
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(userAccount,
			linkTo(methodOn(UserAccountController.class).getAvailableUserAccountsForTeam(teamId)).withSelfRel());
	}

	/**
	 * Gets {@link UserAccount}s that are active but not a part of {@link
	 * ca.projectTOMi.tomi.model.Team}.
	 *
	 * @return List of UserAccounts that are active, but not a part of any team
	 */
	@GetMapping ("/teams/unassigned")
	public Resources<Resource<UserAccount>> getUnassignedUserAccounts() {
		final List<Resource<UserAccount>> available = this.userAccountService.getUnassignedUserAccounts()
			.stream()
			.map(this.assembler::toResource)
			.collect(Collectors.toList());

		return new Resources<>(available,
			linkTo(methodOn(UserAccountController.class).getUnassignedUserAccounts()).withSelfRel());
	}

	@ExceptionHandler ({UserAccountNotFoundException.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("UserAccount Exception: " + e.getClass());

		return ResponseEntity.status(400).build();
	}
}
