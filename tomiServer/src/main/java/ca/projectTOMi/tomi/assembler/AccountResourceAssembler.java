package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URISyntaxException;
import ca.projectTOMi.tomi.controller.AccountController;
import ca.projectTOMi.tomi.model.Account;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * AccountResourceAssembler is responsible for creating a standard resource for {@link Account}
 * objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Component
public class AccountResourceAssembler implements ResourceAssembler<Account, Resource<Account>> {

  @Override
  public Resource<Account> toResource(Account account) {
    Resource<Account> resource = new Resource<>(account,
      linkTo(methodOn(AccountController.class).getAccount(account.getId())).withSelfRel(),
      linkTo(methodOn(AccountController.class).getActiveAccounts()).withRel("accounts"),
      linkTo(methodOn(AccountController.class).setAccountInactive(account.getId())).withRel("delete")
    );

    try {
      resource.add(linkTo(methodOn(AccountController.class).updateAccount(account.getId(), account)).withRel("update"));
    } catch (URISyntaxException e) {
      System.out.println(e);
    }

    return resource;
  }
}
