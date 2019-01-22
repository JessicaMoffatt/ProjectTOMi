package ca.projectTOMi.tomi.model;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MapKeyColumn;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Data;

/**
 * A Team represents a group of Accounts whom work under the same team lead. The use of the Team is
 * to provide access to Accounts’ time sheets and productivity reports.
 *
 * @author Karol Talbot
 * @version 1
 */
@Entity
@Data
public class Team {
  /**
   * The unique identifier for this Team.
   */
  @Id
  @GeneratedValue (generator = "team_sequence")
  @SequenceGenerator (
    name = "team_sequence",
    sequenceName = "team_sequence",
    allocationSize = 1
  )
  private Long id;

  /**
   * The UserAccount of the team leader for this Team.
   */
  @OneToOne
  @MapKeyColumn(name = "id")
  private UserAccount teamLead;

  /**
   * The name of this Team.
   */
  @Size (max = 100)
  private String teamName;

  /**
   * If this Team is active.
   */
  @NotNull
  private boolean active;

}
