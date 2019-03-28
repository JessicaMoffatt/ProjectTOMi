package ca.projectTOMi.tomi.exception;

/**
 * The requested {@link ca.projectTOMi.tomi.model.Entry} could not be updated because it was not in
 * a valid state. An Entry object must be in either the LOGGING or REJECTED states to be updated.
 *
 * @author Iliya Kiritchkov
 * @version 1
 */
public class IllegalEntryStateException extends RuntimeException {

}
