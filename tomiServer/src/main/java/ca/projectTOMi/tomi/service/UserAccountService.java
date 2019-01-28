package ca.projectTOMi.tomi.service;

import java.time.LocalDate;
import java.time.temporal.TemporalField;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;
import ca.projectTOMi.tomi.exception.TimesheetNotFoundException;
import ca.projectTOMi.tomi.exception.UserAccountNotFoundException;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.UserAccountRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link UserAccount} objects.
 *
 * @author Karol Talbot
 * @version 1.3
 */
@Service
public final class UserAccountService {

    @Autowired private UserAccountRepository repository;
    @Autowired private TeamService teamService;
    @Autowired private TimesheetService timesheetService;


  /**
   * Gets a {@link UserAccount} object with the provided id.
   *
   * @param id
   *   the unique identifier for the UserAccount to be found
   *
   * @return UserAccount object matching the provided id
   */
  public UserAccount getUserAccount(Long id) {
    return this.repository.findById(id).orElseThrow(UserAccountNotFoundException::new);
  }


  /**
   * Gets a list of all @{link UserAccount}s that are active.
   *
   * @return List containing all UserAccounts that are active
   */
  public List<UserAccount> getActiveUserAccounts() {
    return repository.getAllByActive(true);
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
    return repository.getUserAccountsByTeam(teamService.getTeamById(teamId));
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
    }).orElseThrow(UserAccountNotFoundException::new);
  }

  /**
   * Creates a new timesheet every monday at 1am for all active users.
   */
  @Scheduled (cron = "0 0 1 * * MON")
  public void createWeeklyTimesheet() {
    List<UserAccount> accounts = repository.getAllByActive(true);
    LocalDate date = LocalDate.now();
    for (UserAccount a : accounts) {
      timesheetService.createTimesheet(date, a);
    }
  }

  /**
   * Creates a new user as well as creates a timesheet for the current week dated on the previous
   * monday.
   *
   * @param userAccount
   *   the new UserAccount
   *
   * @return the created and saved userAccount
   */
  public UserAccount createUserAccount(UserAccount userAccount) {
    UserAccount newUserAccount = repository.save(userAccount);
    TemporalField fieldISO = WeekFields.of(Locale.FRANCE).dayOfWeek();
    LocalDate date = LocalDate.now().with(fieldISO, 1);
    if (!timesheetService.createTimesheet(date, newUserAccount))
      throw new TimesheetNotFoundException();
    return newUserAccount;
  }

  /**
   * Gets the {@link UserAccount} responsible for leading the {@link ca.projectTOMi.tomi.model.Team}.
   *
   * @param teamId
   *   the unique identifier for the Team
   *
   * @return the UserAccount for the Team lead
   */
  public UserAccount getTeamLead(Long teamId) {
    return teamService.getTeamById(teamId).getTeamLead();
  }
  
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
     * Gets the {@link UserAccount}s that are not part of the provided {@link ca.projectTOMi.tomi.model.Team} and not team leads.
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
