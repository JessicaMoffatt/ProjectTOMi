package ca.projectTOMi.tomi.service;

import java.util.List;
import java.util.stream.Collectors;
import ca.projectTOMi.tomi.model.Account;
import ca.projectTOMi.tomi.persistence.AccountRepository;
import org.springframework.stereotype.Component;
/**
 *
 * @author Karol Talbot
 * @version 1
 */
@Component
public class AccountService {

  AccountRepository repository;

  public AccountService(AccountRepository repository) {
    this.repository = repository;
  }

  public Account getAccount(Long id){
    return this.repository.getOne(id);
  }

  public List<Account> getActiveAccounts(){
    return repository.getAllByActive(true).stream().collect(Collectors.toList());
  }
}
