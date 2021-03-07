'use strict';
module.exports = function cleanupDateRanges(arr) {
  let cleanerArray = [];
  for (let i = 0; i < 16; i = i + 2) {
    if (/^[a-zA-z]/.test(arr[i + 1])) {
      cleanerArray.push(arr[i]);
      cleanerArray.push(arr[i + 1]);
    } else {
      let safeString = `${arr[i]}${arr[i + 1]}`;
      cleanerArray.push(safeString);
    }
  }
  return cleanerArray;
};
