package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.authorization.permission.TimesheetPermission;
import ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.exception.TeamNotFoundException;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.TeamRepository;
import ca.projectTOMi.tomi.persistence.TimesheetAuthRepository;
import ca.projectTOMi.tomi.persistence.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
/**
 * @author Karol Talbot
 */
@Service
public class TimesheetAuthService {
	private final TimesheetAuthRepository timesheetAuthRepository;
	private final UserAccountRepository userAccountRepository;
	private final TeamRepository teamRepository;

	@Autowired
	public TimesheetAuthService(final TimesheetAuthRepository timesheetAuthRepository,
	                            final UserAccountRepository userAccountRepository,
	                            final TeamRepository teamRepository){
		this.timesheetAuthRepository = timesheetAuthRepository;
		this.userAccountRepository = userAccountRepository;
		this.teamRepository = teamRepository;
	}

	public void setNewUserAccountPolicy(UserAccount newUserAccount){

		TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
		for(TimesheetPermission t: TimesheetPermission.values()) {
			authPolicy.setPermission(t);
			authPolicy.setRequestingUser(newUserAccount);
			authPolicy.setTimesheetOwner(newUserAccount);
			this.timesheetAuthRepository.save(authPolicy);
		}
	}

	public void addMemberToTeam(final UserAccount newMember, Team team){
		team = this.teamRepository.findById(team.getId()).orElseThrow(TeamNotFoundException::new);
		if(team.getTeamLead() != null) {
			TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
			authPolicy.setTimesheetOwner(newMember);
			authPolicy.setRequestingUser(team.getTeamLead());
			authPolicy.setPermission(TimesheetPermission.READ);
			this.timesheetAuthRepository.save(authPolicy);
		}
	}

	public void removeMemberFromTeam(UserAccount oldMember, Team team){
		team = this.teamRepository.findById(team.getId()).orElseThrow(TeamNotFoundException::new);
		if(team.getTeamLead() != null) {
			TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
			authPolicy.setTimesheetOwner(oldMember);
			authPolicy.setRequestingUser(team.getTeamLead());
			authPolicy.setPermission(TimesheetPermission.READ);
			this.timesheetAuthRepository.delete(authPolicy);
		}
	}

	public void setTeamLead(UserAccount newTeamLead, Team team){
		final TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
		final List<UserAccount> teamMembers = this.userAccountRepository.getUserAccountsByTeamOrderById(team);
		authPolicy.setPermission(TimesheetPermission.READ);
		authPolicy.setRequestingUser(newTeamLead);
		for(final UserAccount member: teamMembers){
			authPolicy.setTimesheetOwner(member);
			this.timesheetAuthRepository.save(authPolicy);
		}
	}

	public void removeTeamLead(UserAccount oldTeamLead, Team team){
		final TimesheetAuthorizationPolicy authPolicy = new TimesheetAuthorizationPolicy();
		final List<UserAccount> teamMembers = this.userAccountRepository.getUserAccountsByTeamOrderById(team);
		authPolicy.setRequestingUser(oldTeamLead);
		authPolicy.setPermission(TimesheetPermission.READ);
		for(final UserAccount member: teamMembers){
			authPolicy.setTimesheetOwner(member);
			this.timesheetAuthRepository.delete(authPolicy);
		}
	}
}
