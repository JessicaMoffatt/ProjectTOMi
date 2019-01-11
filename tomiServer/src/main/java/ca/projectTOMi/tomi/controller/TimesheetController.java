package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.persistence.TeamRepository;
import ca.projectTOMi.tomi.persistence.TimesheetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


/*
    TimesheetController is used to control the flow of data regarding unit types to/from the view.
 */

@RestController
public class TimesheetController {

    private TimesheetRepository repository;

    public TimesheetController(TimesheetRepository repository) {
        this.repository = repository;
    }
}
