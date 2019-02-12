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
  private TeamRepository repository;

  /**
   * Constructor for the TeamService service.
   *
   * @param repository
   *   Repository responsible for persisting Team instances
   */
  public TeamService(TeamRepository repository) {
    this.repository = repository;
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
  public Team updateTeam(Long id, Team newTeam) {
    return repository.findById(id).map(team -> {
      team.setTeamName(newTeam.getTeamName());
      team.setActive(newTeam.isActive());
      team.setTeamLead(newTeam.getTeamLead());
      return repository.save(team);
    }).orElseThrow(() -> new TeamNotFoundException());
  }

  /**
   * Gets a {@link Team} object with the provided id.
   *
   * @param id
   *   the unique identifier for the Team to be found
   *
   * @return Team object matching the provided id
   */
  public Team getTeamById(Long id) {
    return repository.findById(id).orElseThrow(() -> new TeamNotFoundException());
  }

  /**
   * Gets a list of all teams that are active.
   *
   * @return List containing all teams that are active
   */
  public List<Team> getActiveTeams() {
    return repository.getAllByActiveOrderById(true).stream().collect(Collectors.toList());
  }

  /**
   * Persists the provided {@link Team}.
   *
   * @param team
   *   Team to be persisted
   *
   * @return the Team that was persisted
   */
  public Team saveTeam(Team team) {

    return repository.save(team);
  }
}
