package ca.projectTOMi.tomi.service;

import java.util.ArrayList;
import java.util.List;
import ca.projectTOMi.tomi.exception.TeamNotFoundException;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.persistence.TeamRepository;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link Team} objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Service
public final class TeamService {
	/**
	 * Repository responsible for accessing and persisting for Team objects.
	 */
	private final TeamRepository repository;

	/**
	 * Services for maintaining business logic surrounding {@link ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy}s.
	 */
	private final TimesheetAuthorizationService timesheetAuthorizationService;
	private final UserAuthorizationService userAuthorizationService;

	/**
	 * Constructor for the TeamService service.
	 *
	 * @param repository
	 * 	Repository responsible for persisting Team instances
	 * @param timesheetAuthorizationService
	 * 	Service responsible for maintaining TimesheetAuthorizationPolicy objects
	 */
	public TeamService(final TeamRepository repository,
	                   final TimesheetAuthorizationService timesheetAuthorizationService,
	                   final UserAuthorizationService userAuthorizationService) {
		this.repository = repository;
		this.timesheetAuthorizationService = timesheetAuthorizationService;
		this.userAuthorizationService = userAuthorizationService;
	}

	/**
	 * Updates the team with the provided id with the provided attributes.
	 *
	 * @param id
	 * 	the unique identifier for the team to be updated
	 * @param newTeam
	 * 	Team object containing the updated attributes
	 *
	 * @return Team containing the updated attributes
	 */
	public Team updateTeam(final Long id, final Team newTeam) {
		return this.repository.findById(id).map(team -> {
			team.setTeamName(newTeam.getTeamName());
			team.setActive(true);
			if (team.getTeamLead() != null) {
				this.timesheetAuthorizationService.removeTeamLead(team.getTeamLead(), team);
			}
			if (newTeam.getTeamLead() != null) {
				this.timesheetAuthorizationService.setTeamLead(newTeam.getTeamLead(), team);
				this.userAuthorizationService.setTeamLead(newTeam.getTeamLead());
			}
			team.setTeamLead(newTeam.getTeamLead());
			return this.repository.save(team);
		}).orElseThrow(TeamNotFoundException::new);
	}

	/**
	 * Gets a {@link Team} object with the provided id.
	 *
	 * @param id
	 * 	the unique identifier for the Team to be found
	 *
	 * @return Team object matching the provided id
	 */
	public Team getTeamById(final Long id) {
		return this.repository.findById(id).orElseThrow(TeamNotFoundException::new);
	}

	/**
	 * Gets a list of all teams that are active.
	 *
	 * @return List containing all teams that are active
	 */
	public List<Team> getActiveTeams() {
		return new ArrayList<>(this.repository.getAllByActiveOrderById(true));
	}

	/**
	 * Creates the provided {@link Team}.
	 *
	 * @param team
	 * 	Team to be created
	 *
	 * @return the Team that was created
	 */
	public Team createTeam(final Team team) {
		team.setActive(true);
		return this.repository.save(team);
	}

	/**
	 * Deletes the provided {@link Team}.
	 *
	 * @param teamId
	 * 	Unique identifier for the team to be deleted
	 */
	public void deleteTeam(final Long teamId) {

		final Team team = this.getTeamById(teamId);
		team.setActive(false);
		team.setTeamLead(null);
		this.repository.save(team);
	}
}
