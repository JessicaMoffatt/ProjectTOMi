package ca.projectTOMi.tomi.assembler;

import ca.projectTOMi.tomi.controller.EntryController;
import ca.projectTOMi.tomi.model.Entry;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

/**
 * EntryResourceAssembler is responsible for creating a standard resource for {@Link Entry}.
 *
 * @author Iliya Kiritchkov
 * @version 1.1
 */
@Component
public class EntryResourceAssembler implements ResourceAssembler<Entry, Resource<Entry>> {

    @Override
    public Resource<Entry> toResource(Entry entry) {
        Resource<Entry> resource = new Resource<>(entry,
                linkTo(methodOn(EntryController.class).getEntry(entry.getId())).withSelfRel(),
                linkTo(methodOn(EntryController.class).getActiveEntries()).withRel("entries"),
                linkTo(methodOn(EntryController.class).deleteEntry(entry.getId())).withRel("delete")
                );

        try {
            resource.add(linkTo(methodOn(EntryController.class).updateEntry(entry.getId(), entry)).withRel("update"));
            resource.add(linkTo(methodOn(EntryController.class).copyEntry(entry.getId())).withRel("copy"));
        } catch (URISyntaxException e) {
            System.out.println(e);
        }

        return resource;
    }
}
