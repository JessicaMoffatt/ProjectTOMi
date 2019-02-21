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

  @Override
  public int hashCode() {
    return this.id.hashCode();
  }

  @Override
  public boolean equals(final Object obj) {
    if (obj.getClass() != UserAuthorizationPolicy.class) {
      return false;
    } else {
      final UserAuthorizationPolicy policyB = (UserAuthorizationPolicy) obj;
      boolean equal = this.permission == policyB.getPermission();
      return equal && this.requestingUser.equals(policyB.getRequestingUser());
    }
  }
}
