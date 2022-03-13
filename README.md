# Promise 
`Promise` is a pattern that represents the eventual completion (or failure) of an asynchronous operation, and its resulting value. ECMAScript 6 (or ES6) introduces it and is widely used to simplify the workflow. This assignment is to implement `Promise` class with vanilla JavaScript (ES5 or ES6). You could see all the specification of Promise here, and the following methods should be implemented. 
* new Promise(executor) 
* Promise.all(iterable) (supposed that iterable is the type of Array<Promise>) 
* Promise.resolve(reason) 
* Promise.reject(value) 
* Promise.prototype.then(func) 
* Promise.prototype.catch(func) 
* Promise.prototype.finally(func) 
  - Just guarantee that it should run on the latest version of Chrome browser.


## example
```
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("test1");
  }, 3000);
});
var p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("test2");
  }, 2000);
});
Promise.all([p1, p2]).then(values => {
  console.log(values); // ["test1", "test2"]
});

var p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("test3");
  }, 2000);
});
p3.then((res) => {
  return res; // "test3"
})
.catch((err) => console.error('error', err))
.finally((res) => {
  console.log("This Promise is finally settled!", res) // This Promise is finally settled! test3
});

var p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("test4");
  }, 2000);
});
p4.then((res) => {
  return res;
})
.catch((err) => {
  console.error('error', err) // error test4
})
.finally((res) => {
  console.log("This Promise is finally settled!", res) // This Promise is finally settled! test4
});
```