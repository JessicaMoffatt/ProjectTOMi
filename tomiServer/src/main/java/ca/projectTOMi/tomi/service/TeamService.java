package ca.projectTOMi.tomi.service;

import java.util.List;
import java.util.stream.Collectors;
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
  private final TeamRepository repository;
  private final ProjectAuthService projectAuthService;

  /**
   * Constructor for the TeamService service.
   *
   * @param repository
   *   Repository responsible for persisting Team instances
   */
  public TeamService(final TeamRepository repository,
                     final ProjectAuthService projectAuthService) {
    this.repository = repository;
    this.projectAuthService = projectAuthService;
  }

  /**
   * Updates the team with the provided id with the provided attributes.
   *
   * @param id
   *   the unique identifier for the team to be updated
   * @param newTeam
   *   Team object containing the updated attributes
   *
   * @return Team containing the updated attributes
   */
  public Team updateTeam(final Long id, final Team newTeam) {
    return this.repository.findById(id).map(team -> {
      team.setTeamName(newTeam.getTeamName());
      team.setActive(true);
      team.setTeamLead(newTeam.getTeamLead());
      return this.repository.save(team);
    }).orElseThrow(TeamNotFoundException::new);
  }

  /**
   * Gets a {@link Team} object with the provided id.
   *
   * @param id
   *   the unique identifier for the Team to be found
   *
   * @return Team object matching the provided id
   */
  public Team getTeamById(final Long id) {
    return this.repository.findById(id).orElseThrow(() -> new TeamNotFoundException());
  }

  /**
   * Gets a list of all teams that are active.
   *
   * @return List containing all teams that are active
   */
  public List<Team> getActiveTeams() {
    return this.repository.getAllByActiveOrderById(true).stream().collect(Collectors.toList());
  }

  /**
   * Persists the provided {@link Team}.
   *
   * @param team
   *   Team to be persisted
   *
   * @return the Team that was persisted
   */
  public Team saveTeam(final Team team) {

    return this.repository.save(team);
  }
}
