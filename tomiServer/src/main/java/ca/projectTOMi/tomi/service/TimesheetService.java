package ca.projectTOMi.tomi.service;

import java.time.LocalDate;
import java.util.List;
import ca.projectTOMi.tomi.exception.IllegalTimesheetModificationException;
import ca.projectTOMi.tomi.exception.TimesheetNotFoundException;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Status;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.TimesheetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Karol Talbot
 * @version 1
 */
@Service
public final class TimesheetService {
  @Autowired private TimesheetRepository repository;
  @Autowired private EntryService entryService;

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

  public boolean createTimesheet(LocalDate date, UserAccount userAccount){
    Timesheet t = new Timesheet();
    t.setStatus(Status.LOGGING);
    t.setStartDate(date);
    t.setUserAccount(userAccount);
    t.setActive(true);
    if(t == repository.save(t))
      return true;
    else
      return false;
  }

  public Timesheet submitTimesheet(Long id){
    Timesheet timesheet = repository.findById(id).orElseThrow(TimesheetNotFoundException::new);
    LocalDate date = LocalDate.now();
    if(timesheet.getStatus() == Status.LOGGING || timesheet.getStatus() == Status.REJECTED){
      List<Status> entryStatuses = repository.getEntriesStatusesByTimesheet(timesheet.getId());
      if(entryStatuses.contains(Status.REJECTED)){
        throw new IllegalTimesheetModificationException();
      }else{
        entryService.submitEntries(timesheet);
      }
      timesheet.setStatus(Status.SUBMITTED);
      timesheet.setSubmitDate(date);
      timesheet = repository.save(timesheet);
    }else{
      throw new IllegalTimesheetModificationException();
    }

    return timesheet;
  }

  public void evaluateTimesheet(Long id){
    List<Status> statuses = repository.getEntriesStatusesByTimesheet(id);
    Timesheet timesheet = repository.findById(id).orElseThrow(TimesheetNotFoundException::new);
    if(!statuses.contains(Status.SUBMITTED) && !statuses.contains(Status.LOGGING)){
      if(statuses.contains(Status.REJECTED)){
        timesheet.setStatus(Status.REJECTED);
      }else{
        timesheet.setStatus(Status.APPROVED);
      }
      repository.save(timesheet);
    }
  }
}
