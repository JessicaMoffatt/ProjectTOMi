package ca.projectTOMi.tomi.authorization;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

@Data
@Entity
public class ProjectAuthorizationPolicy {
  @Id
  @GeneratedValue(generator = "project_auth_sequence")
  @SequenceGenerator(
    name = "project_auth_sequence",
    sequenceName = "project_auth_sequence",
    allocationSize = 1
  )
  private Long id;

  @ManyToOne(targetEntity = UserAccount.class, optional = false)
  private UserAccount requestingUser;

  @Enumerated
  @NotNull
  private ProjectPermission permission;

  @ManyToOne(targetEntity = Project.class, optional = false)
  private Project project;
}
