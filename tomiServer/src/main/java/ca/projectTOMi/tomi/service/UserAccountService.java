package ca.projectTOMi.tomi.service;

import java.util.List;
import java.util.stream.Collectors;

import ca.projectTOMi.tomi.exception.UserAccountNotFoundException;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link UserAccount} objects.
 *
 * @author Karol Talbot
 * @version 1.3
 */
@Service
public class UserAccountService {

    @Autowired UserAccountRepository repository;
    @Autowired TeamService teamService;


    /**
     * Gets a {@link UserAccount} object with the provided id.
     *
     * @param id the unique identifier for the UserAccount to be found
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
     * @param teamId the unique identifier for the team
     * @return List containing all UserAccounts for that team
     */
    public List<UserAccount> getUserAccountsByTeam(Long teamId) {
        return repository.getUserAccountsByTeam(teamService.getTeamById(teamId)).stream().collect(Collectors.toList());
    }

    /**
     * Persists the provided {@link UserAccount}.
     *
     * @param userAccount UserAccount to be persisted
     * @return the UserAccount that was persisted
     */
    public UserAccount saveUserAccount(UserAccount userAccount) {
        return repository.save(userAccount);
    }

    /**
     * Updates the userAccount with the provided id with the provided attributes.
     *
     * @param id             the unique identifier for the userAccount to be updated
     * @param newUserAccount UserAccount object containing the updated attributes
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
    public UserAccount getTeamLead(Long teamId) {
        return teamService.getTeamById(teamId).getTeamLead();
    }

  /**
   * Removes all the members from a team.
   *
   * @param teamId the unique identifier for the team.
   */
  public void removeAllTeamMembers(Long teamId){
      List<UserAccount> teamMembers = getUserAccountsByTeam(teamId);
      for(UserAccount member : teamMembers){
        member.setTeamId(Team.NO_TEAM);
        repository.save(member);
      }
    }

    /**
     * Gets the {@Link UserAccount}s that are not part of the provided {@Link Team} and not team leads.
     *
     * @param teamId the unique identifier for the Team.
     * @return List of UserAccounts that are not part of the Team and not team leads.
     */
    public List<UserAccount> getAvailableUserAccountsForTeam(Long teamId) {
        List<UserAccount> availableUserAccounts = repository.getAllByActive(true);
        availableUserAccounts.removeIf(userAccount -> userAccount.getTeam() != null && userAccount.getTeam().getId() == teamId);
        availableUserAccounts.removeIf(userAccount -> userAccount.getTeam() != null && userAccount.getTeam().getTeamLead().getId() == userAccount.getId());

        return availableUserAccounts;
    }
}