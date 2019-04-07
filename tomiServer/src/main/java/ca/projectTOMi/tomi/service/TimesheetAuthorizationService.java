package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.authorization.permission.TimesheetPermission;
import ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.exception.TeamNotFoundException;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.TeamRepository;
import ca.projectTOMi.tomi.persistence.TimesheetAuthorizationRepository;
import ca.projectTOMi.tomi.persistence.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link TimesheetAuthorizationPolicy} objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Service
public class TimesheetAuthorizationService {
	/**
	 * Repository for persisting TimesheetAuthorizationPolicy objects
	 */
	private final TimesheetAuthorizationRepository timesheetAuthorizationRepository;

	/**
	 * Repository for UserAccounts.
	 */
	private final UserAccountRepository userAccountRepository;

	/**
	 * Repository for Teams.
	 */
	private final TeamRepository teamRepository;

	/**
	 * Creates the TimesheetAuthorizationService.
	 *
	 * @param timesheetAuthorizationRepository
	 * 	Repository for TimesheetAuthorizationPolicy objects
	 * @param userAccountRepository
	 * 	Repository for UserAccounts
	 * @param teamRepository
	 * 	Repository for Teams
	 */
	@Autowired
	public TimesheetAuthorizationService(final TimesheetAuthorizationRepository timesheetAuthorizationRepository,
	                                     final UserAccountRepository userAccountRepository,
	                                     final TeamRepository teamRepository) {
		this.timesheetAuthorizationRepository = timesheetAuthorizationRepository;
		this.userAccountRepository = userAccountRepository;
		this.teamRepository = teamRepository;
	}

	/**
	 * Sets the required permissions for a new UserAccount.
	 *
	 * @param newUserAccount
	 * 	The newly created UserAccount
	 */
	void setNewUserAccountPolicy(final UserAccount newUserAccount) {
		final TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
		for (final TimesheetPermission t : TimesheetPermission.values()) {
			authPolicy.setPermission(t);
			authPolicy.setRequestingUser(newUserAccount);
			authPolicy.setTimesheetOwner(newUserAccount);
			this.timesheetAuthorizationRepository.save(authPolicy);
		}
	}

	/**
	 * Sets the policies when a UserAccount is added to a Team.
	 *
	 * @param newMember
	 * 	The UserAccount added to the Team
	 * @param team
	 * 	The Team the UserAccount was added to
	 */
	void addMemberToTeam(final UserAccount newMember, Team team) {
		team = this.teamRepository.findById(team.getId()).orElseThrow(TeamNotFoundException::new);
		if (team.getTeamLead() != null) {
			final TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
			authPolicy.setTimesheetOwner(newMember);
			authPolicy.setRequestingUser(team.getTeamLead());
			authPolicy.setPermission(TimesheetPermission.READ);
			this.timesheetAuthorizationRepository.save(authPolicy);
		}
	}

	/**
	 * Sets the policies when a UserAccount is removed from a Team.
	 *
	 * @param oldMember
	 * 	The UserAccount removed from the Team
	 * @param team
	 * 	The Team the UserAccount was removed from
	 */
	void removeMemberFromTeam(final UserAccount oldMember, Team team) {
		team = this.teamRepository.findById(team.getId()).orElseThrow(TeamNotFoundException::new);
		if (team.getTeamLead() != null && !oldMember.equals(team.getTeamLead())) {
			final TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
			authPolicy.setTimesheetOwner(oldMember);
			authPolicy.setRequestingUser(team.getTeamLead());
			authPolicy.setPermission(TimesheetPermission.READ);
			this.timesheetAuthorizationRepository.delete(authPolicy);
		}
	}

	/**
	 * Sets the policies when a lead is set to a Team.
	 *
	 * @param newTeamLead
	 * 	The UserAccount of the team lead
	 * @param team
	 * 	The team the UserAccount was added to
	 */
	void setTeamLead(final UserAccount newTeamLead, final Team team) {
		final TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
		final List<UserAccount> teamMembers = this.userAccountRepository.getUserAccountsByTeamOrderById(team);
		authPolicy.setPermission(TimesheetPermission.READ);
		authPolicy.setRequestingUser(newTeamLead);
		for (final UserAccount member : teamMembers) {
			authPolicy.setTimesheetOwner(member);
			if (!member.equals(newTeamLead)) {
				this.timesheetAuthorizationRepository.save(authPolicy);
			}
		}
	}

	/**
	 * Sets the policies when a lead is removed from a Team.
	 *
	 * @param oldTeamLead
	 * 	The UserAccount of the team lead
	 * @param team
	 * 	The team the UserAccount was added to
	 */
	void removeTeamLead(final UserAccount oldTeamLead, final Team team) {
		final TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
		final List<UserAccount> teamMembers = this.userAccountRepository.getUserAccountsByTeamOrderById(team);
		authPolicy.setRequestingUser(oldTeamLead);
		authPolicy.setPermission(TimesheetPermission.READ);
		for (final UserAccount member : teamMembers) {
			if (!member.equals(oldTeamLead)) {
				authPolicy.setTimesheetOwner(member);
				this.timesheetAuthorizationRepository.delete(authPolicy);
			}
		}
	}
}
