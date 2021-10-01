export const ROLES = ["sysadmin", "admin", "editor", "logged in with no role", "public"];
export const RECORD_TYPES = ["dataset", "resource"];
export const STATES = ["archived", "draft", "pending archive", "pending publish", "published"];


/**
 * 
 * Determines if a user should be able to delete a record.
 * 
 * This is used to show or hide the delete button, and is based
 * on user role, record type, and the dataset state.
 * 
 * @return a boolean value indicating whether the user should
 * be able to delete.
 * 
*/
export function canDelete(role, recordType, datasetState) {

  // limit function to known roles, record types, and dataset states
  if (!STATES.includes(datasetState))
    throw new UnknownStateError("Unknown dataset state: " + datasetState);
  if (!ROLES.includes(role))
    throw new UnknownRoleError("Unknown role: " + role);
  if (!RECORD_TYPES.includes(recordType))
    throw new UnknownRecordTypeError("Unknown record type: " + recordType);


  // sysadmins can delete anything
  if (role === "sysadmin") {
    return true; 
  }

  // public users can't delete anything
  else if (role === "public" || role === "logged in with no role") {
    return false;
  } 

  // editors and admins have the same deletion capabilities
  else if (role === "editor" || role === "admin") {

    // admins and editors can only delete datasets if they're in draft state
    if (recordType === "dataset") {
      return datasetState === "draft";
    }

    // admins and editors can delete resources in ANY state except archived
    else if (recordType === "resource") {
      return datasetState !== "archived";
    }

  }

  // we should not ever get here. Getting here means the function's definition is incomplete.
  else {
    throw new Error("canDelete() function's definition is incomplete!")
  }

}


/**
 * 
 * This function shouldn't really be necessary at the UI level, since
 * the API is responsible for returning 404s for records we can't view,
 * but we're specifying it anyhow.
 * 
 * If bcgov#519 is closed and this still wasn't necessary, we can remove it.
 * 
*/ 
export function canView(role, recordType, datasetState) {
  if (role === "logged in with no role" || role === "public") {

    // Public can see published or pending archive states
    if (["published", "pending archive"].includes(datasetState)) {
      return true;
    } else {
      return false;
    }

  }

  return true;
}


export class UnknownRoleError extends Error {}
export class UnknownStateError extends Error {}
export class UnknownRecordTypeError extends Error {}