'use strict';

module.exports = function courseTitles(runTime, arr) {

  let courseTitleArray = [];

  for (let i = 0; i < runTime; i++) {
    courseTitleArray.push(arr[i])
  };

  return courseTitleArray;

};