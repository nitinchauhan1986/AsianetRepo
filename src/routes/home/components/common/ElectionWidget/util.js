/* eslint-disable import/prefer-default-export */
export function getExitPollDataForState(data) {
  const sourceDataMap = {};
  if (
    typeof data !== 'object' ||
    !data ||
    !Array.isArray(data.al_rslt) ||
    data.al_rslt.length === 0
  ) {
    return {};
  }
  const electionData = data.al_rslt;
  const len = electionData.length;
  let sourceData;
  let curParty;
  for (let counter = 0; counter < len; counter += 1) {
    sourceData = electionData[counter];
    if (Array.isArray(sourceData) && sourceData.length > 0) {
      for (
        let partyCounter = 0;
        partyCounter < sourceData.length;
        partyCounter += 1
      ) {
        curParty = sourceData[partyCounter];
        if (curParty) {
          if (!sourceDataMap[curParty.src]) {
            sourceDataMap[curParty.src] = [];
          }
          sourceDataMap[curParty.src].push({
            an: curParty.an,
            color: curParty.cc,
            ws: curParty.ws || 0,
            ls: curParty.ls || 0,
            lsws: (curParty.ws || 0) + (curParty.ls || 0),
          });
        }
      }
    }
  }

  return sourceDataMap;
}
