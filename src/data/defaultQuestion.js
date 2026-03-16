export const defaultQuestions = [
  {
    id: "twoSum",
    title: "Find two numbers whose sum equals target",
    code: `let arr = [1,8,4,2,9];

function twosum(arr, target) {

  let seen = new Map();

  for (let i = 0; i < arr.length; i++) {

    let required = target - arr[i];

    if (seen.has(required)) {
      return [required, arr[i]];
    }

    seen.set(arr[i], i);

  }

  return "no combination found";

}

console.log(twosum(arr,10));`
  }
];