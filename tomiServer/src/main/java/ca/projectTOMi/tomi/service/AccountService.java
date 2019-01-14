package ca.projectTOMi.tomi.service;

import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.exception.AccountNotFoundException;
import ca.projectTOMi.tomi.model.Account;
import ca.projectTOMi.tomi.persistence.AccountRepository;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link Account} objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Service
public class AccountService {

  AccountRepository repository;
  TeamService teamService;

  /**
   * Constructor for the AccountService service.
   *
   * @param repository
   *   Repository responsible for persisting {@link Account} instances
   * @param teamService
   *   Service responsible for interacting with {@link ca.projectTOMi.tomi.model.Team} objects
   */
  public AccountService(AccountRepository repository, TeamService teamService) {
    this.repository = repository;
    this.teamService = teamService;
  }

  /**
   * Gets a {@link Account} object with the provided id.
   *
   * @param id
   *   the unique identifier for the Account to be found
   *
   * @return Account object matching the provided id
   */
  public Account getAccount(Long id) {
    return this.repository.getOne(id);
  }

  /**
   * Gets a list of all accounts that are active.
   *
   * @return List containing all accounts that are active
   */
  public List<Account> getActiveAccounts() {
    return repository.getAllByActive(true).stream().collect(Collectors.toList());
  }

  /**
   * Gets a list of all accounts that are part of the given Team.
   *
   * @param teamId
   *   the unique identifier for the team
   *
   * @return List containing all accounts for that team
   */
  public List<Account> getAccountsByTeam(Long teamId) {
    return repository.getAccountsByTeam(teamService.getTeam(teamId)).stream().collect(Collectors.toList());
  }

  /**
   * Persists the provided {@link Account}.
   *
   * @param account Account to be persisted
   * @return the Account that was persisted
   */
  public Account saveAccount(Account account) {
    return repository.save(account);
  }

  /**
   * Updates the account with the provided id with the provided attributes.
   *
   * @param id
   *   the unique identifier for the account to be updated
   * @param newAccount
   *   Account object containing the updated attributes
   *
   * @return Account containing the updated attributes
   */
  public Account updateAccount(Long id, Account newAccount) {
    return repository.findById(id).map(account -> {
      account.setFirstName(newAccount.getFirstName());
      account.setLastName(newAccount.getLastName());
      account.setTeam(newAccount.getTeam());
      account.setEmail(newAccount.getEmail());
      account.setSalariedRate(newAccount.getSalariedRate());
      account.setProjects(newAccount.getProjects());
      account.setActive(newAccount.isActive());
      return repository.save(account);
    }).orElseThrow(() -> new AccountNotFoundException());
  }
}
