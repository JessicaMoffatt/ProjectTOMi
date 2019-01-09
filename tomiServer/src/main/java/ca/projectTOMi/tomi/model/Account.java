package ca.projectTOMi.tomi.model;

import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.validator.constraints.UniqueElements;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Entity
@Data
public class Account {
    @Id
    @GeneratedValue(generator = "account_sequence")
    @SequenceGenerator(
            name = "account_sequence",
            sequenceName = "account_sequence"
    )
    private Long id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Team team;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @UniqueElements
    private String email;

    @Min(0)
    private Long salariedRate;

    private boolean active;
}
