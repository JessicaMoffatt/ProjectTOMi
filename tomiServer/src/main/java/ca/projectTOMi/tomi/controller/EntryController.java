package ca.projectTOMi.tomi.controller;

import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.persistence.EntryRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class EntryController {
    private EntryRepository repository;
    public EntryController(EntryRepository repository) {this.repository = repository; }

    @PostMapping("/entries")
    public Entry createEntry(@RequestBody Entry entry) { return repository.save(entry); }

    @GetMapping("/entries")
    public List<Entry> all() { return repository.findAll(); }
}
