package ca.projectTOMi.tomi.model;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
public class UserAccount {
  /**
   * The unique identifier for this UserAccount. Used to distinguish between Accounts.
   */
  @Id
  @GeneratedValue (generator = "user_account_sequence")
  @SequenceGenerator (
    name = "user_account_sequence",
    sequenceName = "user_account_sequence",
    allocationSize = 1
  )
  private Long id;

  /**
   * The team this UserAccount is a member of.
   */
  @ManyToOne
  @OnDelete (action = OnDeleteAction.NO_ACTION)
  @JsonBackReference
  private Team team;

  /**
   * This UserAccount holder's first name.
   */
  @NotBlank
  private String firstName;

  /**
   * This UserAccount holder's last name.
   */
  @NotBlank
  private String lastName;

  /**
   * The email address for this UserAccount.
   */
  @NotBlank
  @Column (unique = true)
  private String email;

  /**
   * The salaried rate of this UserAccount multiplied by 100 to remove decimals.
   */
  @Min (0)
  private Long salariedRate;

  @ManyToMany
  private Set<Project> projects = new HashSet<>();

  /**
   * If this UserAccount is active.
   */
  @NotNull
  private boolean active;
}
