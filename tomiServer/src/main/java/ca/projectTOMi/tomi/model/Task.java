package ca.projectTOMi.tomi.model;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Data
public class Task {

    @Id
    @GeneratedValue(generator = "task_sequence")
    @SequenceGenerator(
            name = "task_sequence",
            sequenceName = "task_sequence",
            allocationSize = 1
    )
    private Long taskId;

    @Column(unique = true)
    @NotBlank
    @Size(max = 100)
    private String name;

    private boolean billable;
}
