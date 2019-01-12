package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

import ca.projectTOMi.tomi.controller.AccountController;
import ca.projectTOMi.tomi.model.Account;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
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
      linkTo(methodOn(AccountController.class).getActiveAccounts()).withRel("accounts")
    );
    return resource;
  }
}
