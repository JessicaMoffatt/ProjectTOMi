package ca.projectTOMi.tomi.controller;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.AccountResourceAssembler;
import ca.projectTOMi.tomi.model.Account;
import ca.projectTOMi.tomi.service.AccountService;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Handles HTTP requests for {@link Account} objects in the ProjectTOMi system.
 *
 * @author Karol Talbot
 * @version 1
 */
@RestController
public class AccountController {
  AccountResourceAssembler assembler;
  AccountService service;

  /**
   * Constructor for this AccountController with parameters required for proper function of this
   * controller.
   *
   * @param assembler
   *   converts account objects into resources
   * @param service
   *   provides services required for {@link Account} objects
   */
  public AccountController(AccountResourceAssembler assembler, AccountService service) {
    this.assembler = assembler;
    this.service = service;
  }

  /**
   * Returns a resource representing the requested {@link Account} to the source of a GET request to
   * /accounts/id.
   *
   * @param id
   *   unique identifier for the Account
   *
   * @return Resource representing the Account object.
   */
  @GetMapping ("/accounts/{id}")
  public Resource<Account> getAccount(@PathVariable Long id) {
    Account account = service.getAccount(id);
    return assembler.toResource(account);
  }

  /**
   * Returns a collection of all active accounts the source of a GET request to /accounts.
   *
   * @return Collection of resources representing all active accounts
   */
  @GetMapping ("/accounts")
  public Resources<Resource<Account>> getActiveAccounts() {
    List<Resource<Account>> account = service.getActiveAccounts().stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(account,
      linkTo(methodOn(AccountController.class).getActiveAccounts()).withSelfRel());
  }

  /**
   * Returns a collection of all accounts associated with a given team.
   *
   * @param teamId
   *   unique identifier for the team to be retrieved
   *
   * @return Collection of resources representing all active accounts on a team
   */
  @GetMapping ("/teams/{teamId}/accounts")
  public Resources<Resource<Account>> getAccountsByTeam(@PathVariable Long teamId) {
    List<Resource<Account>> account = service.getAccountsByTeam(teamId).stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(account,
      linkTo(methodOn(AccountController.class).getActiveAccounts()).withSelfRel());
  }

  /**
   * Creates a new {@link Account} with the attributes provided in the POST request to /accounts.
   *
   * @param newAccount
   *   a account object with required information.
   *
   * @return response containing links to the newly created account
   *
   * @throws URISyntaxException
   *   when the created URI is unable to be parsed
   */
  @PostMapping ("/accounts")
  public ResponseEntity<?> createAccount(@RequestBody Account newAccount) throws URISyntaxException {
    Resource<Account> resource = assembler.toResource(service.saveAccount(newAccount));

    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  /**
   * Updates the attributes for a {@link Account} with the provided id with the attributes provided
   * in the PUT request to /accounts/id.
   *
   * @param id
   *   the unique identifier for the Account to be updated
   * @param newAccount
   *   the updated account
   *
   * @return response containing a link to the updated account
   *
   * @throws URISyntaxException
   *   when the created URI is unable to be parsed
   */
  @PutMapping ("/accounts/{id}")
  public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody Account newAccount) throws URISyntaxException {
    Account updatedAccount = service.updateAccount(id, newAccount);
    Resource<Account> resource = assembler.toResource(updatedAccount);
    return ResponseEntity.created(new URI(resource.getId().expand().getHref())).body(resource);
  }

  /**
   * Sets the requested account's active attribute false, removing it from the list of active
   * accounts. Responds to the DELETE requests to /accounts/id.
   *
   * @param id
   *   the unique identifier for the account to be set inactive
   *
   * @return a response without any content
   */
  @DeleteMapping ("/accounts/{id}")
  public ResponseEntity<?> setAccountInactive(@PathVariable Long id) {
    Account account = service.getAccount(id);
    account.setActive(false);
    service.saveAccount(account);

    return ResponseEntity.noContent().build();
  }
}
