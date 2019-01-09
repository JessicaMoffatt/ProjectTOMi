package ca.projectTOMi.tomi.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity
@Data
public class Team {
    @Id
    @GeneratedValue(generator = "team_sequence")
    @SequenceGenerator(
            name = "team_sequence",
            sequenceName = "team_sequence",
            allocationSize = 1
    )
    private Long teamId;

    @OneToOne
    private Account teamLead;

    @Size(max = 100)
    private String teamName;

    private boolean active;

}
