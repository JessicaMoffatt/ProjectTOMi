package ca.projectTOMi.tomi.service;

import ca.projectTOMi.tomi.exception.EntryNotFoundException;
import ca.projectTOMi.tomi.exception.IllegalEntryStateException;
import ca.projectTOMi.tomi.model.Account;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.model.Status;
import ca.projectTOMi.tomi.persistence.AccountRepository;
import ca.projectTOMi.tomi.persistence.EntryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Provides services for {@Link Entry} objects.
 *
 * @author Iliya Kiritchkov
 * @version 1
 */
@Service
public class EntryService {
    private EntryRepository repository;
    private AccountService accountService;

    /**
     * Constructor for the EntryService component.
     *
     * @param repository Repository responsible for persisting {@Link Entry} instances.
     */
    public EntryService(EntryRepository repository, AccountService accountService) {
        this.repository = repository;
        this.accountService = accountService;

    }

    /**
     * Updates the {@Link Entry} with the provided id with the provided attributes.
     * If the updated Entry has a Status of APPROVED or SUBMITTED, an IllegalEntryStateException will
     * be raised as these statuses do not allow any modofication of the contents of an Entry object.
     *
     * If the updated Entry has a Status of LOGGING, the existing Entry will be updated to contain the updated attributes.

     * If the updated Entry has a Status of REJECTED, a new Entry object will be created with identical content to the rejected Entry and it will be saved with an Active status of false. The existing Entry Status will be set to LOGGING.
     *
     * @param id       the unique identifier for the Entry to update.
     * @param newEntry Entry object containing the updated attributes.
     * @return Entry containing the updated attributes.
     */
    public Entry updateEntry(Long id, Entry newEntry) {
        Entry entry = repository.findById(id).orElseThrow(() -> new EntryNotFoundException());

        switch (newEntry.getStatus()) {
            case APPROVED:
                throw new IllegalEntryStateException();

            case SUBMITTED:
                throw new IllegalEntryStateException();

            case REJECTED:
                Entry rejectedEntry = new Entry();
                rejectedEntry.setComponent(newEntry.getComponent());
                rejectedEntry.setProject(newEntry.getProject());
                rejectedEntry.setQuantity(newEntry.getQuantity());
                rejectedEntry.setTask(newEntry.getTask());
                rejectedEntry.setUnitType(newEntry.getUnitType());
                rejectedEntry.setMondayHours(newEntry.getMondayHours());
                rejectedEntry.setTuesdayHours(newEntry.getTuesdayHours());
                rejectedEntry.setWednesdayHours(newEntry.getWednesdayHours());
                rejectedEntry.setThursdayHours(newEntry.getTuesdayHours());
                rejectedEntry.setFridayHours(newEntry.getFridayHours());
                rejectedEntry.setSaturdayHours(newEntry.getSaturdayHours());
                rejectedEntry.setSundayHours(newEntry.getSundayHours());
                rejectedEntry.setStatus(Status.REJECTED);
                rejectedEntry.setActive(false);
                repository.save(rejectedEntry);

                entry.setStatus(Status.LOGGING);
                repository.save(entry);
                break;

            case LOGGING:
                entry.setComponent(newEntry.getComponent());
                entry.setProject(newEntry.getProject());
                entry.setQuantity(newEntry.getQuantity());
                entry.setTask(newEntry.getTask());
                entry.setUnitType(newEntry.getUnitType());
                entry.setMondayHours(newEntry.getMondayHours());
                entry.setTuesdayHours(newEntry.getTuesdayHours());
                entry.setWednesdayHours(newEntry.getWednesdayHours());
                entry.setThursdayHours(newEntry.getTuesdayHours());
                entry.setFridayHours(newEntry.getFridayHours());
                entry.setSaturdayHours(newEntry.getSaturdayHours());
                entry.setSundayHours(newEntry.getSundayHours());
                repository.save(entry);
                break;
        }

        return entry;
    }

    /**
     * Gets a {@link Entry} object with the provided id.
     *
     * @param id the unique identifier for the Entry to find.
     * @return Entry object matching the provided id.
     */
    public Entry getEntry(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntryNotFoundException());
    }

    /**
     * Persists the provided {@Link Entry}
     *
     * @param entry Entry to be persisted.
     * @return Entry that was persisted.
     */
    public Entry saveEntry(Entry entry) {
        return repository.save(entry);
    }

    /**
     * Deletes an {@Link Entry} object. The delete action is based on the current Status of the Entry.
     * If the status is LOGGING then the Entry will be physically deleted from the database, otherwise,
     * the Entry active field will be set to false.
     *
     * @param id id of the Entry to be deleted.
     */
    public void deleteEntry(Long id) {
        Entry entry = this.getEntry(id);

        if (entry.getStatus().equals(Status.LOGGING)) {
            repository.delete(entry);
        } else {
            entry.setActive(false);
            repository.save(entry);
        }
    }

    /**
     * Gets a List of all {@Link Entry} objects belonging to an Account.
     * @param accountId the unique identifier for the Account.
     * @return List containing all Entries belonging to an Account.
     */
    public List<Entry> getEntriesByAccount(Long accountId) {
        return repository.getEntriesByAccount(accountService.getAccount(accountId)).stream().collect(Collectors.toList());
    }

    /**
     * This method is not yet implemented. Project Controller is required.
     * @param projectId
     * @return
     */
    //TODO
    public List<Entry> getEntriesByProject(String projectId) {
        return null;
    }
}