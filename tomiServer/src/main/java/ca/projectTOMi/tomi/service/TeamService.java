package ca.projectTOMi.tomi.service;

import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.exception.TeamNotFoundException;
import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.persistence.TeamRepository;
import org.springframework.stereotype.Component;

@Component
public class TeamService {
  private TeamRepository repository;

  public TeamService(TeamRepository repository){
    this.repository = repository;
  }

  public Team updateTeam(Long id, Team newTeam){
    return repository.findById(id).map(team -> {
      team.setTeamName(newTeam.getTeamName());
      team.setActive(newTeam.isActive());
      team.setTeamLead(newTeam.getTeamLead());
      return repository.save(team);
    }).orElseGet(() -> {
      newTeam.setId(id);
      return repository.save(newTeam);
    });
  }

  public Team getTeam(Long id){
    return repository.findById(id).orElseThrow(()->new TeamNotFoundException());
  }

  public List<Team> getActiveTeams(){
    return repository.getAllByActive(true).stream().collect(Collectors.toList());
  }

  public Team saveTeam(Team team){
    return repository.save(team);
  }
}
