package ca.projectTOMi.tomi.service;

import java.time.LocalDate;
import java.time.temporal.TemporalField;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import ca.projectTOMi.tomi.exception.MinimumAdminAccountException;
import ca.projectTOMi.tomi.exception.MinimumProgramDirectorAccountException;
import ca.projectTOMi.tomi.exception.TimesheetNotFoundException;
import ca.projectTOMi.tomi.exception.UserAccountNotFoundException;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.UserAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

	/**
	 * Repository responsible for accessing and persisting for UserAccount objects.
	 */
	private final UserAccountRepository repository;

	/**
	 * Services for maintaining business logic surrounding {@link Team}s.
	 */
	private final TeamService teamService;

	/**
	 * Services for maintaining business logic surrounding {@link Timesheet}s.
	 */
	private final EntryService entryService;

	/**
	 * Services for maintaining business logic surrounding {@link ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy}s.
	 */
	private final UserAuthorizationService userAuthorizationService;

	/**
	 * Services for maintaining business logic surrounding {@link ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy}s.
	 */
	private final TimesheetAuthorizationService timesheetAuthorizationService;

	/**
	 * Services for maintaining business logic surrounding {@link ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy}s.
	 */
	private final ProjectAuthorizationService projectAuthorizationService;

	/**
	 * Services for sending email.
	 */
	private final TOMiEmailService emailService;

	/**
	 * Provides access to write into the system logs.
	 */
	private final Logger logger = LoggerFactory.getLogger("Email sent");

	/**
	 * Creates the UserAccountService.
	 *
	 * @param repository
	 * 	Repository responsible for accessing and persisting for UserAccount objects
	 * @param teamService
	 * 	Services for Teams
	 * @param entryService
	 * 	Services for Entries and Timesheets
	 * @param userAuthorizationService
	 * 	Services for updating UserAuthorizationPolicy objects
	 * @param timesheetAuthorizationService
	 * 	Services for updating TimesheetAuthorizationPolicy objects
	 * @param projectAuthorizationService
	 * 	Services for updating ProjectAuthorizationPolicy objects
	 * @param emailService
	 * 	Services for sending email
	 */
	@Autowired
	public UserAccountService(final UserAccountRepository repository,
	                          final TeamService teamService,
	                          final EntryService entryService,
	                          final UserAuthorizationService userAuthorizationService,
	                          final TimesheetAuthorizationService timesheetAuthorizationService,
	                          final ProjectAuthorizationService projectAuthorizationService,
	                          final TOMiEmailService emailService) {
		this.repository = repository;
		this.teamService = teamService;
		this.entryService = entryService;
		this.userAuthorizationService = userAuthorizationService;
		this.timesheetAuthorizationService = timesheetAuthorizationService;
		this.projectAuthorizationService = projectAuthorizationService;
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

	/**
	 * Logically deletes the provided UserAccount.
	 *
	 * @param userAccount
	 * 	The userAccount to be deleted
	 */
	public void deleteUserAccount(final UserAccount userAccount) {
		final UserAccount temp = new UserAccount();
		this.checkAdmins(userAccount, temp);
		this.checkProgramDirectors(userAccount, temp);
		userAccount.setEmail(UUID.randomUUID().toString());
		userAccount.setGoogleId(null);
		userAccount.setProgramDirector(false);
		userAccount.setAdmin(false);
		userAccount.setActive(false);
		final UserAccount deletedAccount = this.repository.save(userAccount);
		this.userAuthorizationService.updatedUserAccount(deletedAccount);
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
				this.timesheetAuthorizationService.removeMemberFromTeam(userAccount, userAccount.getTeam());
			}
			if (newUserAccount.getTeam() != null) {
				this.timesheetAuthorizationService.addMemberToTeam(newUserAccount, newUserAccount.getTeam());
			}
			userAccount.setTeam(newUserAccount.getTeam());
			userAccount.setEmail(newUserAccount.getEmail());
			userAccount.setProjects(newUserAccount.getProjects());
			userAccount.setActive(true);
			userAccount.setAdmin(newUserAccount.isAdmin());
			if (newUserAccount.isProgramDirector() && !userAccount.isProgramDirector()) {
				this.projectAuthorizationService.newProgramDirector(newUserAccount);
			} else if (!newUserAccount.isProgramDirector() && userAccount.isProgramDirector()) {
				this.projectAuthorizationService.removeProgramDirector(newUserAccount);
			}
			userAccount.setProgramDirector(newUserAccount.isProgramDirector());
			return this.repository.save(userAccount);
		}).orElseThrow(UserAccountNotFoundException::new);

		this.userAuthorizationService.updatedUserAccount(account);
		return account;
	}

	/**
	 * Creates a new timesheet every monday at 1am for all active users.
	 */
	@Scheduled (cron = "0 0 * * * MON")
	public void createWeeklyTimesheet() {
		final List<UserAccount> accounts = this.repository.getAllByActiveOrderById(true);
		final List<Timesheet> timesheets = this.entryService.getActiveTimesheets();
		final LocalDate date = LocalDate.now();
		for (final UserAccount a : accounts) {
			boolean hasTimesheet = false;
			for (final Timesheet t : timesheets) {
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
		if (newUserAccount.getTeam() != null) {
			this.timesheetAuthorizationService.addMemberToTeam(newUserAccount, newUserAccount.getTeam());
		}
		final TemporalField fieldISO = WeekFields.of(Locale.FRANCE).dayOfWeek();
		final LocalDate date = LocalDate.now().with(fieldISO, 1);
		if (!this.entryService.createTimesheet(date, newUserAccount)) {
			throw new TimesheetNotFoundException();
		}
		this.userAuthorizationService.updatedUserAccount(newUserAccount);
		this.timesheetAuthorizationService.setNewUserAccountPolicy(newUserAccount);
		if (newUserAccount.isProgramDirector()) {
			this.projectAuthorizationService.newProgramDirector(newUserAccount);
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

	/**
	 * Checks the database to ensure there is always at least 1 admin UserAccount and prevents
	 * removing admin status from the last admin account.
	 *
	 * @param oldUserAccount
	 * 	UserAccount before modification
	 * @param newUserAccount
	 * 	UserAccount after modification
	 */
	private void checkAdmins(final UserAccount oldUserAccount, final UserAccount newUserAccount) {
		final int adminCount = this.repository.getAdminCount();
		if (adminCount < 2) {
			if (oldUserAccount.isAdmin() && !newUserAccount.isAdmin()) {
				throw new MinimumAdminAccountException();
			}
		}
	}

	/**
	 * Checks the database to ensure there is always at least 1 program director UserAccount and
	 * prevents removing program director status from the last program director account.
	 *
	 * @param oldUserAccount
	 * 	UserAccount before modification
	 * @param newUserAccount
	 * 	UserAccount after modification
	 */
	private void checkProgramDirectors(final UserAccount oldUserAccount, final UserAccount newUserAccount) {
		final int directorCount = this.repository.getDirectorCount();
		if (directorCount < 2) {
			if (oldUserAccount.isProgramDirector() && !newUserAccount.isProgramDirector()) {
				throw new MinimumProgramDirectorAccountException();
			}
		}
	}

	/**
	 * Sends an email Reminder to users that have not submitted their {@link Timesheet} for the week.
	 */
	@Scheduled (cron = "0 0 16 * * FRI")
	public void emailReminder() {
		final TemporalField fieldISO = WeekFields.of(Locale.FRANCE).dayOfWeek();
		final LocalDate date = LocalDate.now().with(fieldISO, 1);
		final List<Timesheet> timesheets = this.entryService.getTimesheetsByDate(date);
		for (final Timesheet timesheet : timesheets) {
			if (timesheet.getSubmitDate() != null && (timesheet.getUserAccount().getGoogleId() != null)) {
				final String email = timesheet.getUserAccount().getEmail();
				final String subject = TOMiEmailService.SUBJECT;
				final String body = String.format(TOMiEmailService.EMAIL_BODY, timesheet.getUserAccount().getFirstName(), date);
				this.emailService.sendSimpleMessage(email, body);
				this.logger.info("sent reminder to " + email);
			}
		}
	}

	/**
	 * Checks to ensure the UserAccount associated with the application both exists and has the admin
	 * status. This prevents the system from being unable to create new users.
	 */
	@EventListener (ContextRefreshedEvent.class)
	public void createUserPrime() {
		final String email = this.emailService.getEmailAddress();
		final boolean userExists;
		final UserAccount primeAccount = this.repository.findByEmail(email).orElse(new UserAccount());
		userExists = primeAccount.getEmail() != null;
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

	/**
	 * Gets a list of UserAccounts working on a project.
	 *
	 * @param project
	 * 	The Project to get a list of UserAccounts for
	 *
	 * @return List of UserAccounts working on a Project
	 */
	List<UserAccount> getUserAccountsByProjects(final Project project) {
		return this.repository.getAllByActiveTrueAndProjectsOrderById(project);
	}
}
