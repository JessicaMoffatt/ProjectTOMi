package ca.projectTOMi.tomi.service;

import java.time.LocalDate;
import java.time.temporal.TemporalField;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import ca.projectTOMi.tomi.exception.MinimumAdminAccountException;
import ca.projectTOMi.tomi.exception.MinimumProgramDirectorAccountException;
import ca.projectTOMi.tomi.exception.TimesheetNotFoundException;
import ca.projectTOMi.tomi.exception.UserAccountNotFoundException;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
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

	private final UserAccountRepository repository;
	private final TeamService teamService;
	private final EntryService entryService;
	private final UserAuthService userAuthService;
	private final TimesheetAuthService timesheetAuthService;
	private final ProjectAuthService projectAuthService;
	private final TOMiEmailService emailService;

	@Autowired
	public UserAccountService(final UserAccountRepository repository,
	                          final TeamService teamService,
	                          final EntryService entryService,
	                          final UserAuthService userAuthService,
	                          final TimesheetAuthService timesheetAuthService,
	                          final ProjectAuthService projectAuthService,
	                          final TOMiEmailService emailService) {
		this.repository = repository;
		this.teamService = teamService;
		this.entryService = entryService;
		this.userAuthService = userAuthService;
		this.timesheetAuthService = timesheetAuthService;
		this.projectAuthService = projectAuthService;
		this.emailService = emailService;
	}

	/**
	 * Gets a {@link UserAccount} object with the provided id.
	 *
	 * @param id
	 * 	the unique identifier for the UserAccount to be found
	 *
	 * @return UserAccount object matching the provided id
	 */
	public UserAccount getUserAccount(final Long id) {
		return this.repository.findById(id).orElseThrow(UserAccountNotFoundException::new);
	}


	/**
	 * Gets a list of all @{link UserAccount}s that are active.
	 *
	 * @return List containing all UserAccounts that are active
	 */
	public List<UserAccount> getActiveUserAccounts() {
		return this.repository.getAllByActiveOrderById(true);
	}

	/**
	 * Gets a list of all ${@link UserAccount}s that are part of the given Team.
	 *
	 * @param teamId
	 * 	the unique identifier for the team
	 *
	 * @return List containing all UserAccounts for that team
	 */
	public List<UserAccount> getUserAccountsByTeam(final Long teamId) {
		return this.repository.getUserAccountsByTeamOrderById(this.teamService.getTeamById(teamId));
	}

	public void deleteUserAccount(final UserAccount userAccount) {
		final UserAccount temp = new UserAccount();
		this.checkAdmins(userAccount, temp);
		this.checkProgramDirectors(userAccount, temp);
		userAccount.setProgramDirector(false);
		userAccount.setAdmin(false);
		userAccount.setActive(false);
		final UserAccount deletedAccount = this.repository.save(userAccount);
		this.userAuthService.updatedUserAccount(deletedAccount);
	}

	/**
	 * Updates the userAccount with the provided id with the provided attributes.
	 *
	 * @param id
	 * 	the unique identifier for the userAccount to be updated
	 * @param newUserAccount
	 * 	UserAccount object containing the updated attributes
	 *
	 * @return UserAccount containing the updated attributes
	 */
	public UserAccount updateUserAccount(final Long id, final UserAccount newUserAccount) {
		final UserAccount account = this.repository.findById(id).map(userAccount -> {
			this.checkAdmins(userAccount, newUserAccount);
			this.checkProgramDirectors(userAccount, newUserAccount);
			userAccount.setFirstName(newUserAccount.getFirstName());
			userAccount.setLastName(newUserAccount.getLastName());
			if (userAccount.getTeam() != null) {
				this.timesheetAuthService.removeMemberFromTeam(userAccount, userAccount.getTeam());
			}
			if (newUserAccount.getTeam() != null) {
				this.timesheetAuthService.addMemberToTeam(newUserAccount, newUserAccount.getTeam());
			}
			userAccount.setTeam(newUserAccount.getTeam());
			userAccount.setEmail(newUserAccount.getEmail());
			userAccount.setProjects(newUserAccount.getProjects());
			userAccount.setActive(true);
			userAccount.setAdmin(newUserAccount.isAdmin());
			if (newUserAccount.isProgramDirector() && !userAccount.isProgramDirector()) {
				this.projectAuthService.newProgramDirector(newUserAccount);
			} else if (!newUserAccount.isProgramDirector() && userAccount.isProgramDirector()) {
				this.projectAuthService.removeProgramDirector(newUserAccount);
			}
			userAccount.setProgramDirector(newUserAccount.isProgramDirector());
			return this.repository.save(userAccount);
		}).orElseThrow(UserAccountNotFoundException::new);

		this.userAuthService.updatedUserAccount(account);
		return account;
	}

	/**
	 * Creates a new timesheet every monday at 1am for all active users.
	 */
	@Scheduled (cron = "0 * * * * MON")
	public void createWeeklyTimesheet() {
		final List<UserAccount> accounts = this.repository.getAllByActiveOrderById(true);
		final List<Timesheet> timesheets = this.entryService.getActiveTimesheets();
		final LocalDate date = LocalDate.now();
		for (final UserAccount a : accounts) {
			Boolean hasTimesheet = false;
			for (Timesheet t : timesheets) {
				if (a.equals(t.getUserAccount()) && date.toString().equals(t.getStartDate().toString())) {
					hasTimesheet = true;
				}
			}
			if (!hasTimesheet) {
				this.entryService.createTimesheet(date, a);
			}
		}
	}

	/**
	 * Creates a new user as well as creates a timesheet for the current week dated on the previous
	 * monday.
	 *
	 * @param userAccount
	 * 	the new UserAccount
	 *
	 * @return the created and saved userAccount
	 */
	public UserAccount createUserAccount(final UserAccount userAccount) {
		userAccount.setActive(true);
		final UserAccount newUserAccount = this.repository.save(userAccount);
		final TemporalField fieldISO = WeekFields.of(Locale.FRANCE).dayOfWeek();
		final LocalDate date = LocalDate.now().with(fieldISO, 1);
		if (!this.entryService.createTimesheet(date, newUserAccount)) {
			throw new TimesheetNotFoundException();
		}
		this.userAuthService.setNewUserAccountPolicy(newUserAccount);
		this.timesheetAuthService.setNewUserAccountPolicy(newUserAccount);
		if (newUserAccount.isProgramDirector()) {
			this.projectAuthService.newProgramDirector(newUserAccount);
		}
		return newUserAccount;
	}

	/**
	 * Gets the {@link UserAccount} responsible for leading the {@link ca.projectTOMi.tomi.model.Team}.
	 *
	 * @param teamId
	 * 	the unique identifier for the Team
	 *
	 * @return the UserAccount for the Team lead
	 */
	public UserAccount getTeamLead(final Long teamId) {
		return this.teamService.getTeamById(teamId).getTeamLead();
	}

	/**
	 * Removes all the members from a team.
	 *
	 * @param teamId
	 * 	the unique identifier for the team.
	 */
	public void removeAllTeamMembers(final Long teamId) {
		final List<UserAccount> teamMembers = this.getUserAccountsByTeam(teamId);
		for (final UserAccount member : teamMembers) {
			member.setTeamId(Team.NO_TEAM);
			this.repository.save(member);
		}
	}

	/**
	 * Gets the {@link UserAccount}s that are not part of the provided {@link
	 * ca.projectTOMi.tomi.model.Team} and not team leads.
	 *
	 * @param teamId
	 * 	the unique identifier for the Team.
	 *
	 * @return List of UserAccounts that are not part of the Team and not team leads.
	 */
	public List<UserAccount> getAvailableUserAccountsForTeam(final Long teamId) {
		//TODO fix this monstrosity
		final List<UserAccount> availableUserAccounts = this.repository.getAllByActiveOrderById(true);
		return availableUserAccounts;
	}

	/**
	 * Gets {@link UserAccount}s that are not assigned to a {@link Team}.
	 *
	 * @return List of userAccounts that are not part of a Team
	 */
	public List<UserAccount> getUnassignedUserAccounts() {
		return this.repository.getAllByActiveTrueAndTeamIsNullOrderById();
	}

	public List<Timesheet> getTimesheetsByUserAccount(final Long userAccountId) {
		final UserAccount userAccount = this.getUserAccount(userAccountId);
		return this.entryService.getTimesheetsByUserAccount(userAccount);
	}

	private void checkAdmins(final UserAccount oldUserAccount, final UserAccount newUserAccount) {
		final int adminCount = this.repository.getAdminCount();
		if (adminCount < 2) {
			if (oldUserAccount.isAdmin() && !newUserAccount.isAdmin()) {
				throw new MinimumAdminAccountException();
			}
		}
	}

	private void checkProgramDirectors(final UserAccount oldUserAccount, final UserAccount newUserAccount) {
		final int directorCount = this.repository.getDirectorCount();
		if (directorCount < 2) {
			if (oldUserAccount.isProgramDirector() && !newUserAccount.isProgramDirector()) {
				throw new MinimumProgramDirectorAccountException();
			}
		}
	}

	@EventListener (ContextRefreshedEvent.class)
	public void createUserPrime() {
		String email = this.emailService.getEmailAddress();
		Boolean userExists = false;
		UserAccount primeAccount = this.repository.findByEmail(email).orElse(new UserAccount());
		userExists = primeAccount.getFirstName() != null;
		primeAccount.setFirstName("Project");
		primeAccount.setLastName("TOMi");
		primeAccount.setActive(true);
		primeAccount.setAdmin(true);
		primeAccount.setEmail(email);
		if (userExists) {
			this.updateUserAccount(primeAccount.getId(), primeAccount);
		} else {
			this.createUserAccount(primeAccount);
		}
	}
}
