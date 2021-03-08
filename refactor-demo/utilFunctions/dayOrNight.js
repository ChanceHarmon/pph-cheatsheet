'use strict';

module.exports = function dayOrNight(runTime, arr) {

  let timeOfArray = [];

  for (let i = 0; i < runTime; i++) {
    if (/^[Self]/.test(arr[i])) {
      timeOfArray.push('Self Paced Course');
    }
    else if (/^[Saturday,]/.test(arr[i]) || /^[Sunday,]/.test(arr[i])) {
      timeOfArray.push('One day Course')
    } else if (/^[Monday - Friday]/.test(arr[i])) {
      timeOfArray.push('Day Course')
    } else if (/^[Monday - Thursday]/.test(arr[i])) {
      timeOfArray.push('Night Course')
    }
  };
  return timeOfArray;
};
