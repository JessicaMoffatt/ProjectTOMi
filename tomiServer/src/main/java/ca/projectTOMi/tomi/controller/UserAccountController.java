package ca.projectTOMi.tomi.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.UserAccountResourceAssembler;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.service.UserAccountService;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
  UserAccountResourceAssembler assembler;
  UserAccountService service;

  /**
   * Constructor for this AccountController with parameters required for proper function of this
   * controller.
   *
   * @param assembler
   *   converts UserAccount objects into resources
   * @param service
   *   provides services required for UserAccount objects
   */
  public UserAccountController(UserAccountResourceAssembler assembler, UserAccountService service) {
    this.assembler = assembler;
    this.service = service;
  }

  /**
   * Returns a resource representing the requested {@link UserAccount} to the source of a GET
   * request to /accounts/id.
   *
   * @param id
   *   unique identifier for the UserAccount
   *
   * @return Resource representing the UserAccount object.
   */
  @GetMapping ("/user_accounts/{id}")
  public Resource<UserAccount> getAccount(@PathVariable Long id) {
    UserAccount userAccount = service.getUserAccount(id);
    return assembler.toResource(userAccount);
  }

  /**
   * Returns a collection of all active accounts the source of a GET request to /accounts.
   *
   * @return Collection of resources representing all active accounts
   */
  @GetMapping ("/user_accounts")
  public Resources<Resource<UserAccount>> getActiveAccounts() {
    List<Resource<UserAccount>> account = service.getActiveUserAccounts().stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(account,
      linkTo(methodOn(UserAccountController.class).getActiveAccounts()).withSelfRel());
  }

  /**
   * Returns a collection of all accounts associated with a given team.
   *
   * @param teamId
   *   unique identifier for the team to be retrieved
   *
   * @return Collection of resources representing all active accounts on a team
   */
  @GetMapping ("/teams/{teamId}/user_accounts")
  public Resources<Resource<UserAccount>> getAccountsByTeam(@PathVariable Long teamId) {
    List<Resource<UserAccount>> userAccount = service.getUserAccountsByTeam(teamId).stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(userAccount,
      linkTo(methodOn(UserAccountController.class).getAccountsByTeam(teamId)).withSelfRel());
  }

  /**
   * Creates a new {@link UserAccount} with the attributes provided in the POST request to
   * /accounts.
   *
   * @param newUserAccount
   *   a userAccount object with required information.
   *
   * @return the newly created UserAccount
   */
  @PostMapping ("/user_accounts")
  public Resource<UserAccount> createUserAccount(@RequestBody UserAccount newUserAccount) {
    return assembler.toResource(service.saveUserAccount(newUserAccount));
  }

  /**
   * Updates the attributes for a {@link UserAccount} with the provided id with the attributes
   * provided in the PUT request to /accounts/id.
   *
   * @param id
   *   the unique identifier for the UserAccount to be updated
   * @param newUserAccount
   *   the updated userAccount
   *
   * @return the updated userAccount
   */
  @PutMapping ("/user_accounts/{id}")
  public Resource<UserAccount> updateUserAccount(@PathVariable Long id, @RequestBody UserAccount newUserAccount) {
    UserAccount updatedUserAccount = service.updateUserAccount(id, newUserAccount);
    Resource<UserAccount> resource = assembler.toResource(updatedUserAccount);
    return resource;
  }

  /**
   * Sets the requested userAccount's active attribute false, removing it from the list of active
   * accounts. Responds to the DELETE requests to /accounts/id.
   *
   * @param id
   *   the unique identifier for the userAccount to be set inactive
   *
   * @return a response without any content
   */
  @DeleteMapping ("/user_accounts/{id}")
  public ResponseEntity<?> setUserAccountInactive(@PathVariable Long id) {
    UserAccount userAccount = service.getUserAccount(id);
    userAccount.setActive(false);
    service.saveUserAccount(userAccount);

    return ResponseEntity.noContent().build();
  }

  /**
   * Gets the {@link UserAccount} for a {@link ca.projectTOMi.tomi.model.Team}'s leader.
   * @param teamId the unique identifier for the Team
   * @return the team lead's UserAccount
   */
  @GetMapping ("/teams/{teamId}/team_lead")
  public Resource<UserAccount> getTeamLead(@PathVariable Long teamId) {
    return assembler.toResource(service.getTeamLead(teamId));
  }

  /**
   * Gets the {@Link UserAccount}s that are active, not part of the provided Team and not a team lead of any {@Link Team}.
   * @param teamId the unique identifier for the Team
   * @return List of UserAccounts that are active, not part of the provided Team and not a team lead of any Teams.
   */
  @GetMapping ("/user_accounts/{teamId}/available")
  public Resources<Resource<UserAccount>> getAvailableUserAccountsForTeam(@PathVariable Long teamId) {

    List<Resource<UserAccount>> userAccount = service.getAvailableUserAccountsForTeam(teamId).stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(userAccount,
      linkTo(methodOn(UserAccountController.class).getAvailableUserAccountsForTeam(teamId)).withSelfRel());
  }
}
