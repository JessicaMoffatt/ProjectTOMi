package ca.projectTOMi.tomi.assembler;

import ca.projectTOMi.tomi.model.Task;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * TaskResourceAssembler is responsible for creating a standard resource for {@link Task}
 * @author Iliya Kiritchkov
 * @version 1
 */
@Component
public class TaskResourceAssembler implements ResourceAssembler<Task, Resource<Task>> {

    @Override
    public Resource<Task> toResource(Task task) {

        return null;
    }
}
