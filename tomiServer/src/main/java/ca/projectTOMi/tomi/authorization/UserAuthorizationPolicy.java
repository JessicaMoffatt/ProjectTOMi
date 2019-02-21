package ca.projectTOMi.tomi.authorization;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.ManyToOne;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;


@Data
@Entity
@IdClass(UserAuthId.class)
public class UserAuthorizationPolicy {

  @Id
  @ManyToOne (targetEntity = UserAccount.class, optional = false)
  private UserAccount requestingUser;

  @Id
  @Enumerated
  private UserPermission permission;

  @Override
  public int hashCode() {
    return this.requestingUser.hashCode() + this.permission.hashCode();
  }

  @Override
  public boolean equals(final Object obj) {
    if (obj.getClass() != UserAuthorizationPolicy.class) {
      return false;
    } else {
      final UserAuthorizationPolicy policyB = (UserAuthorizationPolicy) obj;
      return this.permission == policyB.getPermission() && this.requestingUser.equals(policyB.getRequestingUser());
    }
  }
}
