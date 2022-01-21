const calculatorScreen = document.querySelector(".calculator-screen");
const operatorBtns = document.querySelectorAll(".operator-btn");
const calculator = {
  add: (x, y) => x + y,
  subtract: (x, y) => x - y,
  multiply: (x, y) => x * y,
  divide: (x, y) => x / y,
  operate: function (operator, x, y) {
    if (operator === "+") {
      return this.add(x, y);
    } else if (operator === "-") {
      return this.subtract(x, y);
    } else if (operator === "*") {
      return this.multiply(x, y);
    } else if (operator === "/") {
      if (y === 0) {
        return "To Infinity and Beyond!";
      }
      return this.divide(x, y);
    }
  },
  currentOperator: null,
  currentVal: "",
  previousVal: "",
  output: "",
  clear: function () {
    this.currentVal = "";
    this.previousVal = "";
    this.output = "";
    this.currentOperator = "";
    this.showCurrentVal();
  },
  updateCurrentVal: function (newInput) {
    if (this.output !== "") {
      this.output = "";
    }
    const newVal = this.currentVal + newInput;
    if (this.isValidNumberStr(newVal)) {
      this.currentVal = newVal;
      this.showCurrentVal();
    }
  },
  isValidNumberStr: (num) => {
    return !!num.match(/^\d*(\.)?(\d+)?$/);
  },
  onUserOperatorInput: function (operator) {
    if (
      this.previousVal !== "" &&
      this.currentVal !== "" &&
      this.currentOperator !== ""
    ) {
      this.onUserEqualsInput();
      this.previousVal = this.output;
    } else if (this.output !== "" && this.previousVal === "") {
      this.previousVal = this.output;
      this.output = "";
    } else if (this.currentVal !== "") {
      this.previousVal = this.currentVal;
      this.currentVal = "";
      this.output = "";
    }
    this.currentOperator = operator;
    this.showCurrentVal();
    this.showSelectedOperator();
  },
  getPrecision: (val) => {
    const [, decimal] = val.toString().split(".");
    return decimal ? decimal.length : 0;
  },
  onUserEqualsInput: function () {
    if (
      this.previousVal !== "" &&
      this.currentVal !== "" &&
      this.currentOperator !== ""
    ) {
      const precision = Math.max(
        this.getPrecision(this.previousVal),
        this.getPrecision(this.currentVal)
      );
      this.output = this.operate(
        this.currentOperator,
        Number(this.previousVal),
        Number(this.currentVal)
      );
      const outputPrecision = this.getPrecision(this.output);
      this.currentVal = "";
      this.previousVal = "";
      this.currentOperator = "";
      this.showCurrentVal(precision, outputPrecision);
      this.showSelectedOperator();
    }
  },
  backspace: function () {
    if (this.currentVal.length > 0) {
      this.currentVal = this.currentVal.slice(0, -1);
      this.showCurrentVal();
    }
  },
  plusMinusSwap: function () {
    if (this.currentVal !== "") {
      if (this.currentVal[0] === "-") {
        this.currentVal = this.currentVal.slice(1);
      } else {
        this.currentVal = "-".concat(this.currentVal);
      }
      this.showCurrentVal();
    }
  },
  calcPercentage: function () {
    if (this.currentVal !== "" && this.currentVal !== ".") {
      this.currentOperator = "/";
      this.previousVal = this.currentVal;
      this.currentVal = 100;
      this.onUserEqualsInput();
    } else if (this.output !== "") {
      this.currentOperator = "/";
      this.previousVal = this.output;
      this.currentVal = 100;
      this.onUserEqualsInput();
    }
  },
  showCurrentVal: function (inputPrecision, outputPrecision) {
    let screenValue;
    if (this.output !== "") {
      screenValue = this.formatOutput(
        this.output,
        inputPrecision,
        outputPrecision
      );
    } else {
      screenValue = this.formatInput(this.currentVal);
    }
    calculatorScreen.textContent = screenValue;
  },
  trimTrailing0Decimals: (val) => {
    if (val.toString().match(/\./)) {
      let i = 0;
      while (true) {
        let currLast = val[val.length - 1 - i];
        if (currLast === "0") {
          i++;
          continue;
        } else if (currLast === ".") {
          i++;
          break;
        } else {
          break;
        }
      }
      return val.slice(0, i && i !== val.length ? -i : val.length);
    }
    return val;
  },
  formatInput: function (input) {
    if (input.toString().length <= 13) {
      return input;
    } else {
      return this.formatTooLong(input);
    }
  },
  formatOutput: function (output, inputPrecision, outputPrecision) {
    if (typeof output !== "number") {
      return output;
    }
    let formattedOutput = output.toString();
    if (formattedOutput.includes(".")) {
      let maxPrecision = 12;
      let minPrecision = 3;
      let userPrecision = Math.max(inputPrecision || 0, outputPrecision || 0);
      let actualPrecision;
      if (minPrecision > userPrecision) {
        actualPrecision = minPrecision;
      } else if (userPrecision > maxPrecision) {
        actualPrecision = maxPrecision;
      } else {
        actualPrecision = userPrecision;
      }
      formattedOutput = Number(formattedOutput).toFixed(actualPrecision);
    }
    if (formattedOutput.length <= 13) {
      return this.trimTrailing0Decimals(formattedOutput);
    } else {
      return this.formatTooLong(formattedOutput);
    }
  },
  formatTooLong: function (value) {
    let [int, dec] = value.split(".");
    if (int.length > 13) {
      let exponent = int.length - 1;
      let shortened = Number(`${int.slice(0, 1)}.${int.slice(1)}`).toFixed(2);
      if (shortened.split(".")[0].length > 1) {
        shortened = `${shortened.slice(0, 1)}.${shortened.slice(
          1,
          2
        )}${shortened.slice(3, 4)}`;
        exponent++;
      }
      return `${this.trimTrailing0Decimals(shortened)}e${exponent}`;
    } else {
      let [base, exp] = value.split("e");
      if (!exp) {
        return this.trimTrailing0Decimals(value.slice(0, 13));
      } else {
        base = Number(base).toFixed(2);
        if (base.split(".")[0].length > 1) {
          base = `${base.slice(0, 1)}.${base.slice(1, 2)}${base.slice(3, 4)}`;
          exp++;
        }
        base = this.trimTrailing0Decimals(base);
        return `${base}e${exp}`;
      }
    }
  },
  showSelectedOperator: function () {
    const currThis = this;
    operatorBtns.forEach(function (operatorBtn) {
      if (operatorBtn.value === currThis.currentOperator) {
        operatorBtn.classList.add("selected-operator");
      } else {
        operatorBtn.classList.remove("selected-operator");
      }
    });
  },
};

//button click listeners
document.querySelectorAll("button").forEach((btn) => {
  const inputType =
    btn.attributes["inputtype"] && btn.attributes["inputtype"].value;
  if (inputType === "number") {
    btn.addEventListener("click", (e) => {
      calculator.updateCurrentVal(e.target.value);
    });
  } else if (inputType === "operator") {
    btn.addEventListener("click", (e) => {
      calculator.onUserOperatorInput(e.target.value);
    });
  } else if (inputType === "equals") {
    btn.addEventListener("click", () => {
      calculator.onUserEqualsInput();
    });
  } else if (inputType === "clear") {
    btn.addEventListener("click", () => {
      calculator.clear();
    });
  } else if (inputType === "back") {
    btn.addEventListener("click", () => {
      calculator.backspace();
    });
  } else if (inputType === "percent") {
    btn.addEventListener("click", () => {
      calculator.calcPercentage();
    });
  } else if (inputType === "plusminus") {
    btn.addEventListener("click", () => {
      calculator.plusMinusSwap();
    });
  }
});

//keystroke listeners
document.body.addEventListener("keyup", (e) => {
  if (e.key.match(/[\d\.]/)) {
    calculator.updateCurrentVal(e.key);
  } else if (e.key.match(/[\*\/\+\-]/)) {
    calculator.onUserOperatorInput(e.key);
  } else if (e.key === "=" || e.key.toLowerCase() === "enter") {
    calculator.onUserEqualsInput();
  } else if (e.key.toLowerCase() === "backspace") {
    calculator.backspace();
  }
});
