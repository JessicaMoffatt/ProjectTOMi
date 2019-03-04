package ca.projectTOMi.tomi.authorization.permission;

/**
 * @author Karol Talbot
 */
public enum UserPermission {
  READ_LISTS,

  // Unit type
  READ_UNIT_TYPE,
  WRITE_UNIT_TYPE,
  CREATE_UNIT_TYPE,
  DELETE_UNIT_TYPE,

  // Client
  READ_CLIENT,
  WRITE_CLIENT,
  CREATE_CLIENT,
  DELETE_CLIENT,

  // Task
  READ_TASK,
  WRITE_TASK,
  CREATE_TASK,
  DELETE_TASK,

  // Team
  READ_TEAM,
  WRITE_TEAM,
  CREATE_TEAM,
  DELETE_TEAM,

  // User account
  READ_USER_ACCOUNT,
  WRITE_USER_ACCOUNT,
  CREATE_USER_ACCOUNT,
  DELETE_USER_ACCOUNT,

  //Project
  CREATE_PROJECT,
  DELETE_PROJECT
}
