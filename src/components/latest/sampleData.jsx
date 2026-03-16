export const INITIAL_SECTIONS = [
    { id: "sec-1", name: "Standard Algorithms", category: "dsa", type: "dsa" },
    { id: "sec-2", name: "Core Concepts", category: "js", type: "theory" },
    { id: "sec-3", name: "React Hooks", category: "react", type: "theory" },
    { id: "sec-4", name: "Semantic HTML", category: "html", type: "theory" },
];

export const INITIAL_ITEMS = [

    // ---------- DSA ----------
    {
        id: "item-1",
        sectionId: "sec-1",
        category: "dsa",
        title: "Two Sum",
        difficulty: "Easy",
        description: "Find two numbers that add up to a target.",
        solutions: [
            {
                id: "sol-1",
                label: "Hash Map",
                code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}`
            }
        ],
        type: "dsa"
    },

    {
        id: "item-2",
        sectionId: "sec-1",
        category: "dsa",
        title: "Reverse String",
        difficulty: "Easy",
        description: "Reverse a given string.",
        solutions: [
            {
                id: "sol-2",
                label: "Built-in",
                code: `function reverseString(str){
  return str.split('').reverse().join('');
}`
            }
        ],
        type: "dsa"
    },

    {
        id: "item-3",
        sectionId: "sec-1",
        category: "dsa",
        title: "Valid Parentheses",
        difficulty: "Easy",
        description: "Check if parentheses are valid.",
        solutions: [
            {
                id: "sol-3",
                label: "Stack",
                code: `function isValid(s){
  const stack=[];
  const map={')':'(',']':'[','}':'{'};
  for(let char of s){
    if(map[char]){
      if(stack.pop()!==map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length===0;
}`
            }
        ],
        type: "dsa"
    },

    {
        id: "item-4",
        sectionId: "sec-1",
        category: "dsa",
        title: "Maximum Subarray",
        difficulty: "Medium",
        description: "Find maximum sum of contiguous subarray.",
        solutions: [
            {
                id: "sol-4",
                label: "Kadane Algorithm",
                code: `function maxSubArray(nums){
  let max=nums[0],sum=0;
  for(let n of nums){
    sum=Math.max(n,sum+n);
    max=Math.max(max,sum);
  }
  return max;
}`
            }
        ],
        type: "dsa"
    },

    {
        id: "item-5",
        sectionId: "sec-1",
        category: "dsa",
        title: "Binary Search",
        difficulty: "Easy",
        description: "Search element in sorted array.",
        solutions: [
            {
                id: "sol-5",
                label: "Iterative",
                code: `function binarySearch(arr,target){
  let l=0,r=arr.length-1;
  while(l<=r){
    const mid=Math.floor((l+r)/2);
    if(arr[mid]===target) return mid;
    if(arr[mid]<target) l=mid+1;
    else r=mid-1;
  }
  return -1;
}`
            }
        ],
        type: "dsa"
    },

    // ---------- JS ----------

    {
        id: "item-6",
        sectionId: "sec-2",
        category: "js",
        title: "Closures",
        description: "Understand lexical scope and closures.",
        answer:
            "A closure allows a function to access variables from its outer scope even after the outer function has executed.",
        type: "theory"
    },

    {
        id: "item-7",
        sectionId: "sec-2",
        category: "js",
        title: "Event Bubbling",
        description: "How events propagate in DOM.",
        answer:
            "Event bubbling means events propagate from the target element up through its ancestors in the DOM tree.",
        type: "theory"
    },

    {
        id: "item-8",
        sectionId: "sec-2",
        category: "js",
        title: "Hoisting",
        description: "Explain JavaScript hoisting.",
        answer:
            "Hoisting is JavaScript's default behavior of moving declarations to the top of their scope before execution.",
        type: "theory"
    },
    // ---------- JS ----------

{
    id: "item-6",
    sectionId: "sec-2",
    category: "js",
    title: "What is JavaScript?",
    description: "Definition of JavaScript.",
    answer:
        "JavaScript is a lightweight, interpreted (JIT-compiled), dynamically typed, single-threaded programming language used to build interactive web applications. It supports asynchronous and event-driven programming.",
    type: "theory"
},

{
    id: "item-7",
    sectionId: "sec-2",
    category: "js",
    title: "ECMAScript",
    description: "Standard of JavaScript.",
    answer:
        "ECMAScript is the official standard that defines how JavaScript works, including its syntax, rules, and features.",
    type: "theory"
},

{
    id: "item-8",
    sectionId: "sec-2",
    category: "js",
    title: "Hoisting",
    description: "Explain JavaScript hoisting.",
    answer:
        "Hoisting is JavaScript's behavior where variable and function declarations are moved to the top of their scope during the memory creation phase before execution.",
    type: "theory"
},

{
    id: "item-9",
    sectionId: "sec-2",
    category: "js",
    title: "Temporal Dead Zone (TDZ)",
    description: "Understanding TDZ.",
    answer:
        "The Temporal Dead Zone is the time between when a variable declared with let or const is hoisted and when it is initialized. Accessing it during this time throws a ReferenceError.",
    type: "theory"
},

{
    id: "item-10",
    sectionId: "sec-2",
    category: "js",
    title: "Closures",
    description: "Understand lexical scope and closures.",
    answer:
        "A closure is created when an inner function remembers and accesses variables from its outer function's scope even after the outer function has finished executing.",
    type: "theory"
},

{
    id: "item-11",
    sectionId: "sec-2",
    category: "js",
    title: "Event Loop",
    description: "How asynchronous JavaScript works.",
    answer:
        "The Event Loop allows JavaScript to perform non-blocking asynchronous operations. It continuously checks the call stack and moves callbacks from the task queue or microtask queue when the stack becomes empty.",
    type: "theory"
},

{
    id: "item-12",
    sectionId: "sec-2",
    category: "js",
    title: "Promises",
    description: "Handling asynchronous operations.",
    answer:
        "A Promise is an object used to handle asynchronous operations. It represents a future result that can be pending, fulfilled, or rejected.",
    type: "theory"
},

{
    id: "item-13",
    sectionId: "sec-2",
    category: "js",
    title: "Async / Await",
    description: "Simplified asynchronous code.",
    answer:
        "Async/await is syntactic sugar over promises that allows asynchronous code to be written in a synchronous-looking style.",
    type: "theory"
},

{
    id: "item-14",
    sectionId: "sec-2",
    category: "js",
    title: "Event Bubbling",
    description: "How events propagate in DOM.",
    answer:
        "Event bubbling is when an event starts at the target element and propagates upward through its parent elements in the DOM tree.",
    type: "theory"
},

{
    id: "item-15",
    sectionId: "sec-2",
    category: "js",
    title: "Event Delegation",
    description: "Handling events efficiently.",
    answer:
        "Event delegation is a technique where a single event listener is attached to a parent element to handle events for multiple child elements using event bubbling.",
    type: "theory"
},

{
    id: "item-16",
    sectionId: "sec-2",
    category: "js",
    title: "Debounce vs Throttle",
    description: "Controlling frequent function calls.",
    answer:
        "Debounce delays the execution of a function until a specified time after the last event trigger, while throttle limits the function to run at most once within a specific time interval.",
    type: "theory"
},

{
    id: "item-17",
    sectionId: "sec-2",
    category: "js",
    title: "call, apply, bind",
    description: "Control the value of this.",
    answer:
        "call, apply, and bind are methods used to control the value of 'this'. call and apply invoke the function immediately, while bind returns a new function with 'this' bound.",
    type: "theory"
},

{
    id: "item-18",
    sectionId: "sec-2",
    category: "js",
    title: "Deep Copy vs Shallow Copy",
    description: "Copying objects in JavaScript.",
    answer:
        "A shallow copy copies only the first level of an object, while a deep copy creates a completely independent copy including nested objects.",
    type: "theory"
},

{
    id: "item-19",
    sectionId: "sec-2",
    category: "js",
    title: "Garbage Collection",
    description: "Automatic memory management.",
    answer:
        "Garbage collection is an automatic process where the JavaScript engine frees memory that is no longer reachable by the program.",
    type: "theory"
},

{
    id: "item-20",
    sectionId: "sec-2",
    category: "js",
    title: "Web Workers",
    description: "Running scripts in background.",
    answer:
        "Web Workers allow JavaScript to run in a background thread separate from the main UI thread, preventing UI blocking during heavy computations.",
    type: "theory"
},

    // ---------- React ----------

    {
        id: "item-9",
        sectionId: "sec-3",
        category: "react",
        title: "useState",
        description: "State management hook.",
        answer:
            "useState is a React Hook that lets you add state to functional components.",
        type: "theory"
    },

    {
        id: "item-10",
        sectionId: "sec-3",
        category: "react",
        title: "useEffect",
        description: "Side effects in React.",
        answer:
            "useEffect runs side effects in functional components such as fetching data or updating the DOM.",
        type: "theory"
    },

    // ---------- HTML ----------

    {
        id: "item-11",
        sectionId: "sec-4",
        category: "html",
        title: "Semantic HTML",
        description: "Importance of semantic tags.",
        answer:
            "Semantic HTML uses meaningful tags like header, article, section to improve accessibility and SEO.",
        type: "theory"
    },

    {
        id: "item-12",
        sectionId: "sec-4",
        category: "html",
        title: "Accessibility",
        description: "Building accessible web pages.",
        answer:
            "Accessibility ensures websites are usable by people with disabilities using proper HTML structure and ARIA roles.",
        type: "theory"
    }

];