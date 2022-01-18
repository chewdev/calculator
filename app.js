const calculator = {
  add: (x, y) => x + y,
  subtract: (x, y) => x - y,
  multiply: (x, y) => x * y,
  divide: (x, y) => x / y,
  operate: (operator, x, y) => {
    if (operator === "+") {
      return this.add(x, y);
    } else if (operator === "-") {
      return this.subtract(x, y);
    } else if (operator === "*") {
      return this.multiply(x, y);
    } else if (operator === "/") {
      return this.divide(x, y);
    }
  },
  currentVal: null,
  previousVals: [],
  updateCurrentVal: (newInput) => {
    const newVal = currentVal + newInput;
    if (this.isValidNumberStr(newVal)) {
      this.currentVal = newVal;
    }
  },
  isValidNumberStr: (num) => {
    return !!num.match(/^[1-9]\d*(\.\d+)?$/);
  },
};
