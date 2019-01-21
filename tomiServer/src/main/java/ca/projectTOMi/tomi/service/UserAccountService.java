package ca.projectTOMi.tomi.service;

import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.exception.UserAccountNotFoundException;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.UserAccountRepository;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link UserAccount} objects.
 *
 * @author Karol Talbot
 * @version 1.2
 */
@Service
public class UserAccountService {

  UserAccountRepository repository;
  TeamService teamService;

  /**
   * Constructor for the UserAccountService service.
   *
   * @param repository
   *   Repository responsible for persisting {@link UserAccount} instances
   * @param teamService
   *   Service responsible for interacting with {@link ca.projectTOMi.tomi.model.Team} objects
   */
  public UserAccountService(UserAccountRepository repository, TeamService teamService) {
    this.repository = repository;
    this.teamService = teamService;
  }

  /**
   * Gets a {@link UserAccount} object with the provided id.
   *
   * @param id
   *   the unique identifier for the UserAccount to be found
   *
   * @return UserAccount object matching the provided id
   */
  public UserAccount getUserAccount(Long id) {
    return this.repository.findById(id).orElseThrow(() -> new UserAccountNotFoundException());
  }

  /**
   * Gets a list of all @{link UserAccount}s that are active.
   *
   * @return List containing all UserAccounts that are active
   */
  public List<UserAccount> getActiveUserAccounts() {
    return repository.getAllByActive(true).stream().collect(Collectors.toList());
  }

  /**
   * Gets a list of all ${@link UserAccount}s that are part of the given Team.
   *
   * @param teamId
   *   the unique identifier for the team
   *
   * @return List containing all UserAccounts for that team
   */
  public List<UserAccount> getUserAccountsByTeam(Long teamId) {
    return repository.getUserAccountsByTeam(teamService.getTeamById(teamId)).stream().collect(Collectors.toList());
  }

  /**
   * Persists the provided {@link UserAccount}.
   *
   * @param userAccount
   *   UserAccount to be persisted
   *
   * @return the UserAccount that was persisted
   */
  public UserAccount saveUserAccount(UserAccount userAccount) {
    return repository.save(userAccount);
  }

  /**
   * Updates the userAccount with the provided id with the provided attributes.
   *
   * @param id
   *   the unique identifier for the userAccount to be updated
   * @param newUserAccount
   *   UserAccount object containing the updated attributes
   *
   * @return UserAccount containing the updated attributes
   */
  public UserAccount updateUserAccount(Long id, UserAccount newUserAccount) {
    return repository.findById(id).map(userAccount -> {
      userAccount.setFirstName(newUserAccount.getFirstName());
      userAccount.setLastName(newUserAccount.getLastName());
      userAccount.setTeam(newUserAccount.getTeam());
      userAccount.setEmail(newUserAccount.getEmail());
      userAccount.setSalariedRate(newUserAccount.getSalariedRate());
      userAccount.setProjects(newUserAccount.getProjects());
      userAccount.setActive(newUserAccount.isActive());
      return repository.save(userAccount);
    }).orElseThrow(() -> new UserAccountNotFoundException());
  }

  /**
   * Gets the {@link UserAccount} responsible for leading the {@link ca.projectTOMi.tomi.model.Team}.
   *
   * @param teamId the unique identifier for the Team
   * @return the UserAccount for the Team lead
   */
  public UserAccount getTeamLead(Long teamId){
    return teamService.getTeamById(teamId).getTeamLead();
  }
}
