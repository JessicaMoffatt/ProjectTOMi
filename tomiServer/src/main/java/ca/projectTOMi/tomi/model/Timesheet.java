package ca.projectTOMi.tomi.model;

import lombok.Data;

import java.time.LocalDate;
import javax.persistence.*;

/**
 * class representing a single timesheet for a user for a specific week.  Entries (task ,client, hours)
 * on the timesheet are attached by referencing it.
 */

@Entity
@Data
public class Timesheet {
    @Id
    @GeneratedValue(generator = "timesheet_sequence")
    @SequenceGenerator(
            name = "timesheet_sequence",
            sequenceName = "timesheet_sequence",
            allocationSize = 1
    )

    /*
     * the unique id of the timesheet
     */
    private Long timesheetId;


    /*
     * The userAccount of the user that the timesheet belongs to
     */
    @ManyToOne
    private UserAccount userAccount;

    /*
     * the submission status of the timesheet, one of: logging, submitted, approved, rejected
     */
    @Enumerated
    private Status status;

    /*
     * the day of the week that the timesheet begins on
     */
    private LocalDate startDate;

    /*
     * the date that the timesheet was submitted.
     */
    private LocalDate submitDate;

    /**
     * if the timesheet is active.
     */
    private boolean active;
}
