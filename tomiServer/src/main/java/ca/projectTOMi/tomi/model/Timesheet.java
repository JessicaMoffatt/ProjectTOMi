package ca.projectTOMi.tomi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDate;
import javax.persistence.*;

/**
 * Timesheet represents a single timesheet for a user for a specific week.  Entries (task ,client, hours)
 * on the timesheet are attached by referencing it.
 *
 * @author James Andrade and Karol Talbot
 * @version 1.1
 *
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
    @MapKeyColumn(name = "id")
    private UserAccount userAccount;

    /**
     * The submission status of the timesheet, one of: logging, submitted, approved, rejected.
     */
    @Enumerated
    private Status status;

    /**
     * The day of the week that the timesheet begins on.
     */
    @JsonIgnore
    private LocalDate startDate;

    /**
     * The date that the timesheet was submitted.
     */
    @JsonIgnore
    private LocalDate submitDate;

    /**
     * If the timesheet is active.
     */
    private boolean active;

    @JsonProperty(value="startDate")
    public String getStartDate(){
        return this.startDate == null? "" : this.startDate.toString();
    }

    @JsonProperty(value="submitDate")
    public String getSubmitDate(){
        return this.submitDate == null? "" : this.submitDate.toString();
    }

    public void setSubmitDate(String date){
        this.submitDate = LocalDate.parse(date);
    }

    public String getTimesheet(){
        return this.id + " " + this.startDate + " " + this.userAccount.getFirstName();
    }
}
