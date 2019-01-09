package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.model.Team;
import ca.projectTOMi.tomi.persistence.TeamRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TeamController {
    TeamRepository repository;

    public TeamController(TeamRepository repository){
        this.repository = repository;
    }

    @PostMapping("/team")
    public Team createTeam(@RequestBody Team team){
        return repository.save(team);
    }
}
