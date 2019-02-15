package ca.projectTOMi.tomi.authorization;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.NotNull;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;


@Data
@Entity
public class UserAuthorizationPolicy {
  @Id
  @GeneratedValue (generator = "user_auth_sequence")
  @SequenceGenerator (
    name = "user_auth_sequence",
    sequenceName = "user_auth_sequence",
    allocationSize = 1
  )
  private Long id;

  @ManyToOne (targetEntity = UserAccount.class, optional = false)
  private UserAccount requestingUser;

  @Enumerated
  @NotNull
  private UserPermission permission;

}
