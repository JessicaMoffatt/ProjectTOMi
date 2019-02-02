package ca.projectTOMi.tomi.model;

import lombok.Data;

import java.time.LocalDate;
import javax.persistence.*;

/**
 * Timesheet represents a single timesheet for a user for a specific week.  Entries (task ,client, hours)
 * on the timesheet are attached by referencing it.
 */

@Entity
@Data
public final class Timesheet {
    @Id
    @GeneratedValue(generator = "timesheet_sequence")
    @SequenceGenerator(
            name = "timesheet_sequence",
            sequenceName = "timesheet_sequence",
            allocationSize = 1
    )

    /**
     * The unique id of the timesheet.
     */
    private Long id;

    /**
     * The userAccount of the user that the timesheet belongs to.
     */
    @ManyToOne
    private UserAccount userAccount;

    /**
     * The submission status of the timesheet, one of: logging, submitted, approved, rejected.
     */
    @Enumerated
    private Status status;

    /**
     * The day of the week that the timesheet begins on.
     */
    private LocalDate startDate;

    /**
     * The date that the timesheet was submitted.
     */
    private LocalDate submitDate;

    /**
     * If the timesheet is active.
     */
    private boolean active;

    public String getTimesheet(){
        return this.id + " " + this.startDate + " " + this.userAccount.getFirstName();
    }
}
