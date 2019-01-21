package ca.projectTOMi.tomi.service;

import java.util.Date;
import java.util.List;
import ca.projectTOMi.tomi.exception.TimesheetNotFoundException;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.TimesheetRepository;
import org.springframework.scheduling.annotation.Scheduled;
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
        timesheet.setTimesheetId(newTimesheet.getTimesheetId());
        return timesheet;
      }
    ).orElseThrow(()->new TimesheetNotFoundException());
  }

  public void createTimesheet(Date date, UserAccount userAccount){

  }


}
