# Questions

Q1: Explain the output of the following code and why

```js
    setTimeout(function() {
      console.log("1");
    }, 100);
    console.log("2");
```

**Answer**:
It first prints `2`. Then, `100ms` later, `1` is printed.
This is because even though `1` is declared first, it is managed
by a `setTimeout` expression, that runs asynchronously after
a given amount of milliseconds (`100`).

Q2: Explain the output of the following code and why

```js
    function foo(d) {
      if(d < 10) {
        foo(d+1);
      }
      console.log(d);
    }
    foo(0);
```
**Answer**:
It displays a sequence of number in descending order (`10`, `9`, ..., `0`).
Starting from a base digit (`d`) the function is called recursively,
increaseing its value until it's `10`. Then, the call stack is reverted
by displaying the values of `d` from the highest (`10`) to the lowest (`0`).

Q3: If nothing is provided to `foo` we want the default response to be `5`. Explain the potential issue with the following code:

```js
    function foo(d) {
      d = d || 5;
      console.log(d);
    }
```
**Answer**:
The function prints `5` when the given number `d` is `0`.
This happens because in JavaScript the logical OR operator (`||`)
considers `0` as `falsy`, in which case, as we have two expressions, 
it will resolve the statement by returning the whatever the 
last expression resolves to (`5`). If we want to consider `0` and,
assuming we only want to log numbers,
we could update the logic by explicitly checking whether `d`
is a number or not, e.g.: 
```
d = isNaN(d) ? 5 : d;
```

Q4: Explain the output of the following code and why

```js
    function foo(a) {
      return function(b) {
        return a + b;
      }
    }
    var bar = foo(1);
    console.log(bar(2))
```
**Answer**:
This snippet prints `3`. The `foo` function reveices `a = 1`, and is 
considered a Higher Order Function as it returns another (annonymous closure) function. The later, when invoked, will receive `b = 2`, an will be able to 
access, not only the variables declared on its own scope (`b = 2`), but also
the ones available on its parent one (`a = 1`). Then will return
`2 + 1 = 3`. This coding pattern is called `function currying`, and it's
particularly convenient towards hiding implementation details while
keeping control on your data privacy - through the scope chain. 
On the negative side, this pattern can lead to performance and memory issues, 
as active closures cannot be garbage collected.

Q5: Explain how the following function would be used

```js
    function double(a, done) {
      setTimeout(function() {
        done(a * 2);
      }, 100);
    }
```

**Answer**:
`double` is a Higher Order Function as it receives another function
as an argument (`done`, also referred as a callback), apart from an
argument `a`. When `double` is invoked, it waits `100ms` before 
invoking `done`, which will send an argument with the doubled value of `a`.
We can capture the resulting value by simply passing a function
on the second argument of `double`.
```
//prints 6, 100ms after the Higher Order Function is invoked
double(3, x => console.log(x));
```
This pattern is often used to orchestrate asyncrhonous executions, 
like other more recent techniques (`promises` and `async / await`).