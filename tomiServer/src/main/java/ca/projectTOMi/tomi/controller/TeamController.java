package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.persistence.TeamRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TeamController {
    TeamRepository repository;

    public TeamController(TeamRepository repository){
        this.repository = repository;
    }

    @PostMapping("/teams")
    public Team createTeam(@RequestBody Team team){
        return repository.save(team);
    }

    @GetMapping("/teams")
    public List<Team> all(){
        return repository.findAll();
    }

    @GetMapping("/teams/{teamId}")
    public Team getTeam(@PathVariable Long teamId){
        Team t = repository.findById(teamId).orElseThrow(()-> new RuntimeException() );
        return t;
    }

    @GetMapping("/teams/active")
    public List<Team> findActive(){
        return repository.getAllByActive(true);
    }
}
