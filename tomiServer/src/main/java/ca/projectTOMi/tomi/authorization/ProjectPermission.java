package ca.projectTOMi.tomi.authorization;

public enum ProjectPermission {
  READ,
  WRITE,

  // Entry
  EVALUATE_ENTRIES,

  // Expense
  CREATE_EXPENSE,
  DELETE_EXPENSE,

  // Budget
  READ_BUDGET
}
