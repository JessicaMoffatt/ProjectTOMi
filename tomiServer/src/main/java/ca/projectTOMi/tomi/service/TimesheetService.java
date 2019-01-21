package ca.projectTOMi.tomi.service;

import java.time.LocalDate;
import java.util.List;
import ca.projectTOMi.tomi.exception.TimesheetNotFoundException;
import ca.projectTOMi.tomi.model.Status;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.TimesheetRepository;
import org.springframework.stereotype.Service;

/**
 *
 * @author Karol Talbot
 * @version 1
 */
@Service
public class TimesheetService {
  TimesheetRepository repository;

  public TimesheetService(TimesheetRepository repository){
    this.repository = repository;
  }

  public List<Timesheet> getActiveTimesheets(){
    return repository.getAllByActive(true);
  }

  public Timesheet saveTimesheet(Timesheet timesheet){
    return repository.save(timesheet);
  }

  public Timesheet getTimesheetById(Long id){
    return repository.findById(id).orElseThrow(()->new TimesheetNotFoundException());
  }

  public Timesheet updateTimesheet(Long id, Timesheet newTimesheet){
    return repository.findById(id).map(timesheet -> {
        timesheet.setStatus(newTimesheet.getStatus());
        timesheet.setSubmitDate(newTimesheet.getSubmitDate());
        timesheet.setId(newTimesheet.getId());
        return timesheet;
      }
    ).orElseThrow(()->new TimesheetNotFoundException());
  }

  public void createTimesheet(LocalDate date, UserAccount userAccount){
    Timesheet t = new Timesheet();
    t.setStatus(Status.LOGGING);
    t.setStartDate(date);
    t.setUserAccount(userAccount);
    t.setActive(true);
    t = repository.save(t);
  }


}
