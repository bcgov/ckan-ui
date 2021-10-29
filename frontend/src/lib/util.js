/**
 * Identifies what a user's role is in relation to a dataset.
 * 
 * This is used for deletion and visibility logic.
 * 
 * @return one of "sysadmin", "admin", "editor", "logged in with no role", "public"
 * 
*/
export function getUserRoleForDataset(dataset, user, orgTree) {

  if (user.loading || dataset.dataLoading || !user.loggedIn)
    return "public";

  if (user.sysAdmin) return "sysadmin";

  let org, parentorg;

  // orgs are only nested by one level so we use a simple
  // nested loop. This finds the org and its parent (if applicable)
  orgfinder:
  for (let o of Object.values(orgTree)) {
    if (o.id === dataset.owner_org) {
      org = o; break;
    } else {
      for (let suborg of (o.children || [])) {
        if (suborg.id === dataset.owner_org) {
          org = suborg; parentorg = o; break orgfinder;
        }
      }
    }
  }

  if (org && user.userPermissions) {
    if (user.userPermissions[org.name])
      return user.userPermissions[org.name];
    if (parentorg && user.userPermissions[parentorg.name])
      return user.userPermissions[parentorg.name];
  }

  return "logged in with no role";
}


/**
 * Identify which state a dataset is in.
 * 
 * This is used for deletion and visibility logic.
 * 
 * @return one of "archived", "draft", "pending archive", "pending publish", "published"
 * 
**/
export function getDatasetState(dataset) {
  if (!dataset || !dataset.publish_state) throw new Error("Invalid input");

  let state = dataset.publish_state.toLowerCase();

  if (!["archived", "draft", "pending archive", "pending publish", "published"].includes(state))
    throw new Error("Invalid input");

  return state;
}


/**
 * 
 * Convert bytes to a human readable file size
 * 
**/
export function humanReadableFileSize(bytes) {
  let size = bytes / 1000;
  let amt = "KB";
  let sizes = ["MB", "GB", "TB"];
  while (size > 999 && sizes.length) {
    amt = sizes.shift();
    size = size / 1000;
  }
  return `${size.toFixed(1)} ${amt}`;
}