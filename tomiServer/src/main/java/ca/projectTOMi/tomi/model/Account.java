package ca.projectTOMi.tomi.model;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * A model class that contains information about accounts in the TOMi system.
 *
 * @author Karol Talbot
 * @version 1
 */
@Entity
@Data
public class Account {
  /**
   * The unique identifier for this Account. Used to distinguish between Accounts.
   */
  @Id
  @GeneratedValue (generator = "account_sequence")
  @SequenceGenerator (
    name = "account_sequence",
    sequenceName = "account_sequence",
    allocationSize = 1
  )
  private Long id;

  /**
   * The team this Account is a member of.
   */
  @ManyToOne
  @OnDelete (action = OnDeleteAction.NO_ACTION)
  private Team team;

  /**
   * This Account holder's first name.
   */
  @NotBlank
  private String firstName;

  /**
   * This Account holder's last name.
   */
  @NotBlank
  private String lastName;

  /**
   * The email address for this Account.
   */
  @NotBlank
  @Column (unique = true)
  private String email;

  /**
   * The salaried rate of this Account multiplied by 100 to remove decimals.
   */
  @Min (0)
  private Long salariedRate;

  @ManyToMany
  private Set<Project> projects = new HashSet<>();

  /**
   * If this Account is active.
   */
  private boolean active;
}
