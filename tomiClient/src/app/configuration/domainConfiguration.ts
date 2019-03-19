export const domain: string ='http://localhost:8080/';

/** The link used to get,post, and delete entries. */
export const timesheetUrl = domain + 'timesheets';
/** The link used to get all timesheets for a specified user.*/
export const userTimesheetsUrl = timesheetUrl + 'user_accounts';
/** The link used to GET, POST and DELETE users. */
export const userAccountUrl = domain + 'user_accounts';
/** The link used to GET, POST and DELETE unit types. */
export const unitTypeUrl = domain + 'unit_types';
