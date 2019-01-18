package ca.projectTOMi.tomi.assembler;

import ca.projectTOMi.tomi.model.Entry;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * EntryResourceAssembler is responsible for creating a standard resource for {@Link Entry}.
 *
 * @author Iliya Kiritchkov
 * @version 1
 */
@Component
public class EntryResourceAssembler implements ResourceAssembler<Entry, Resource<Entry>> {

    @Override
    public Resource<Entry> toResource(Entry entry) {
        return null;
    }
}
