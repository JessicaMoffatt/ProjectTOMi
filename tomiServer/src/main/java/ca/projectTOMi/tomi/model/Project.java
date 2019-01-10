package ca.projectTOMi.tomi.model;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import lombok.Data;

/**
 * A Project represents a project that either needs to be completed, or has been completed
 * (dependent on it's active status.) Projects are worked on by specific {@link Account} lead by a project
 * manager.
 *
 * @author Karol Talbot
 * @version 1
 */
@Entity
@Data
@Table (name = "project")
public class Project {
  /**
   * The unique identifier for this Project.
   */
  @Id
  private String projectId;

  /**
   * The Client this Project is for.
   */
  @ManyToOne
  private Client client;

  /**
   * The Account managing this Project.
   */
  @OneToOne
  private Account projectManager;

  /**
   * The name of this Project
   */
  @NotBlank
  private String projectName;

  /**
   * The budget assigned to this Project multiplied by 100 to remove decimals.
   */
  @Min (0)
  private Long budget;

  /**
   * The rate at which this Project members' billable hours will be billed to the client at multiplied by 100 to remove decimals.
   */
  @Min (0)
  private Long billableRate;

  /**
   * The Accounts that are members of this Project.
   */
  @ManyToMany
  private Set<Account> projectMembers = new HashSet<>();

  /**
   * If this Project is active.
   */
  private boolean active;
}
