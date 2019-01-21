package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URISyntaxException;
import ca.projectTOMi.tomi.controller.UserAccountController;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * UserAccountResourceAssembler is responsible for creating a standard resource for {@link UserAccount}
 * objects.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Component
public class UserAccountResourceAssembler implements ResourceAssembler<UserAccount, Resource<UserAccount>> {

  @Override
  public Resource<UserAccount> toResource(UserAccount userAccount) {
    Resource<UserAccount> resource = new Resource<>(userAccount,
      linkTo(methodOn(UserAccountController.class).getAccount(userAccount.getId())).withSelfRel(),
      linkTo(methodOn(UserAccountController.class).getActiveAccounts()).withRel("accounts"),
      linkTo(methodOn(UserAccountController.class).setUserAccountInactive(userAccount.getId())).withRel("delete"),
      linkTo(methodOn(UserAccountController.class).updateUserAccount(userAccount.getId(), userAccount)).withRel("update")
    );

    return resource;
  }
}
