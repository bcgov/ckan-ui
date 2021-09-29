import fs from 'fs';

function gatherRules() {

  // files are bundled and tests are run from top-level directory (frontend);
  // __dirname is not useful here so we provide the full relative path.
  const rulesHtml = fs.readFileSync("./tests/unit/data/519-rules.html", "utf-8");
  const parser = new window.DOMParser;
  const rulesDom = parser.parseFromString(rulesHtml, "text/html");
  const rulesDoc = rulesDom.documentElement;

  const rows = [...rulesDoc.querySelectorAll("tbody tr")];

  return rows.map(row => {
    let [role, recordType, datasetState, expected] = [...row.cells].map(cell => cell.textContent.toLowerCase().trim());

    if (recordType === "record") recordType = "dataset";

    // we understand that all states pertain to the dataset
    datasetState = datasetState.replace(/^record = /, "");

    return [role, recordType, datasetState, expected];
  });
}

/*

  Some of the rules pertain to whether a record can be
  viewed rather than whether it can be deleted. To partition
  the two groups we use a simple heuristic.
*/
export function refersToVisibility(description) {
  return description[3].match(/to view/);
}


export function refersToDeletability(description) {
  return description[3].match(/to delete/);
}

export const ticket519Table = gatherRules();