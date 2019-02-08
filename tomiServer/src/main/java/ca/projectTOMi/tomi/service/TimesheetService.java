package ca.projectTOMi.tomi.service;

import java.time.LocalDate;
import java.util.List;
import ca.projectTOMi.tomi.exception.IllegalTimesheetModificationException;
import ca.projectTOMi.tomi.exception.TimesheetNotFoundException;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Status;
import ca.projectTOMi.tomi.model.Timesheet;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.EntryRepository;
import ca.projectTOMi.tomi.persistence.TimesheetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Provides services for {@link Timesheet} objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Service
public final class TimesheetService {
  private final TimesheetRepository repository;
  private final EntryRepository entryRepository;
  private final EntryService entryService;
  private final UserAccountService userAccountService;

  @Autowired
  public TimesheetService(TimesheetRepository repository, EntryRepository entryRepository, EntryService entryService, UserAccountService userAccountService) {
    this.repository = repository;
    this.entryRepository = entryRepository;
    this.entryService = entryService;
    this.userAccountService = userAccountService;
  }

  /**
   * Gets a list of all @{link Timesheet}s that are active.
   *
   * @return List containing all Timesheet that are active
   */
  public List<Timesheet> getActiveTimesheets() {
    return repository.getAllByActive(true);
  }


  public List<Entry> getEntriesByTimesheet(Long timesheeetId){
    Timesheet timesheet = repository.findById(timesheeetId).orElseThrow(TimesheetNotFoundException::new);
    return  entryRepository.getAllByActiveTrueAndTimesheet(timesheet);
  }

  /**
   * Persists the provided {@link Timesheet}.
   *
   * @param timesheet
   *   Timesheet to be persisted
   *
   * @return the Timesheet that was persisted
   */
  public Timesheet saveTimesheet(Timesheet timesheet) {
    return repository.save(timesheet);
  }

  /**
   * Gets a {@link Timesheet} object with the provided id.
   *
   * @param id
   *   the unique identifier for the Timesheet to be found
   *
   * @return Timesheet object matching the provided id
   */
  public Timesheet getTimesheetById(Long id) {
    return repository.findById(id).orElseThrow(() -> new TimesheetNotFoundException());
  }

  /**
   * Updates the Timesheet with the provided id with the provided attributes.
   *
   * @param id
   *   the unique identifier for the Timesheet to be updated
   * @param newTimesheet
   *   Timesheet object containing the updated attributes
   *
   * @return Timesheet containing the updated attributes
   */
  public Timesheet updateTimesheet(Long id, Timesheet newTimesheet) {
    return repository.findById(id).map(timesheet -> {
        timesheet.setStatus(newTimesheet.getStatus());
        timesheet.setSubmitDate(newTimesheet.getSubmitDate());
        timesheet.setId(newTimesheet.getId());
        return timesheet;
      }
    ).orElseThrow(() -> new TimesheetNotFoundException());
  }

  /**
   * Creates a new timesheet with the provided date for the provided user.
   *
   * @param date
   *   The week the timesheet if required for
   * @param userAccount
   *   The account of the user
   *
   * @return if the account was created successfully
   */
  public boolean createTimesheet(LocalDate date, UserAccount userAccount) {
    Timesheet t = new Timesheet();
    t.setStatus(Status.LOGGING);
    t.setStartDate(date);
    t.setUserAccount(userAccount);
    t.setActive(true);
    if (t == repository.save(t))
      return true;
    else
      return false;
  }

  /**
   * @param id
   *
   * @return
   */
  public Timesheet submitTimesheet(Long id) {
    Timesheet timesheet = repository.findById(id).orElseThrow(TimesheetNotFoundException::new);
    LocalDate date = LocalDate.now();
    if (timesheet.getStatus() == Status.LOGGING || timesheet.getStatus() == Status.REJECTED) {
      List<Status> entryStatuses = repository.getEntriesStatusesByTimesheet(timesheet.getId());
      if (entryStatuses.contains(Status.REJECTED)) {
        throw new IllegalTimesheetModificationException();
      } else {
        entryService.submitTimesheetEntries(timesheet);
      }
      timesheet.setStatus(Status.SUBMITTED);
      timesheet.setSubmitDate(date.toString());
      timesheet = repository.save(timesheet);
    } else {
      throw new IllegalTimesheetModificationException();
    }

    return timesheet;
  }

  /**
   * Evaluates the {@link Status} of the timesheet with the provided id. If all {@link
   * ca.projectTOMi.tomi.model.Entry}s are approved the timesheet is given the approved status. If
   * all entries are approved or rejected the timesheet is given the rejected status. Otherwise,
   * it's status remains unchanged.
   *
   * @param id
   *   the unique identifier for the timesheet
   */
  public void evaluateTimesheet(Long id) {
    List<Status> statuses = repository.getEntriesStatusesByTimesheet(id);
    Timesheet timesheet = repository.findById(id).orElseThrow(TimesheetNotFoundException::new);
    if (!statuses.contains(Status.SUBMITTED) && !statuses.contains(Status.LOGGING)) {
      if (statuses.contains(Status.REJECTED)) {
        timesheet.setStatus(Status.REJECTED);
      } else {
        timesheet.setStatus(Status.APPROVED);
      }
      repository.save(timesheet);
    }
  }

  public List<Timesheet> getTimesheetsByUserAccount(Long userAccountId){
    UserAccount userAccount = userAccountService.getUserAccount(userAccountId);
    return repository.getAllByActiveTrueAndUserAccountOrderByStartDateDesc(userAccount);
  }
}
