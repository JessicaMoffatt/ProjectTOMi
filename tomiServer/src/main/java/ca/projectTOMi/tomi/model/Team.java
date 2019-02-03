package ca.projectTOMi.tomi.model;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MapKeyColumn;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
public final class Team {
  public static final Long NO_TEAM = -1L;

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
  @JsonProperty (value="leadId")
  @JsonIdentityInfo (generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
  @JsonIdentityReference (alwaysAsId = true)
  private UserAccount teamLead;

  /**
   * The name of this Team.
   */
  @Size (max = 100)
  @NotBlank
  private String teamName;

  /**
   * If this Team is active.
   */
  @NotNull
  private boolean active;

  @JsonProperty
  public void setLeadId(Long id){
    UserAccount userAccount = null;
    if(id != NO_TEAM) {
      userAccount = new UserAccount();
      userAccount.setId(id);
    }
    this.setTeamLead(userAccount);
  }
}
