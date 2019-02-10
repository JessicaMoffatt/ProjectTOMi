package ca.projectTOMi.tomi.authorization;

public interface AuthorizationManager{
  public boolean requestAuthorization(String URI, String request);
  public boolean linkAuthorization(String URI, String request);
}
