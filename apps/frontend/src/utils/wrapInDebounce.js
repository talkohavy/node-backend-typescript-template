function wrapInDebounce(fnToRun, milliseconds = 300) {
  let timerId;

  return (...args) => {
    if (timerId) clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = null;
      fnToRun(...args); // This line is similar as to doing: fnToRun.apply(null, arguments); without passing outerArgs, which is something you might see in other people's code.
    }, milliseconds);
  };
}

export { wrapInDebounce };
