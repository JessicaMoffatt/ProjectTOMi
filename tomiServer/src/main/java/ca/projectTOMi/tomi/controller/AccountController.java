package ca.projectTOMi.tomi.controller;

import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.assembler.AccountResourceAssembler;
import ca.projectTOMi.tomi.model.Account;
import ca.projectTOMi.tomi.service.AccountService;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 *
 * @author Karol Talbot
 * @version 1
 */
@RestController
public class AccountController {
  AccountResourceAssembler assembler;
  AccountService service;

  public AccountController(AccountResourceAssembler assembler, AccountService service) {
    this.assembler = assembler;
    this.service = service;
  }

  @GetMapping("/accounts/{id}")
  public Resource<Account> getAccount(@PathVariable Long id){
    Account account = service.getAccount(id);
    return assembler.toResource(account);
  }

  @GetMapping("/accounts")
  public Resources<Resource<Account>> getActiveAccounts(){
    List<Resource<Account>> account = service.getActiveAccounts().stream().map(assembler::toResource).collect(Collectors.toList());

    return new Resources<>(account,
      linkTo(methodOn(AccountController.class).getActiveAccounts()).withSelfRel());
  }
}
