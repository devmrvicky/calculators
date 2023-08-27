// import all file here
import { copyResult } from "./copyResult.js";
import { getControlMenus } from "./getControlMenus.js";
import { getExpression } from "./getExpression.js";
import { getPreviousCalcElem } from "./getPreviousCalcElem.js";
import { getTimeObj } from "./getTimeObj.js";

const calcBtns = document.querySelectorAll("td");
const resultArea = document.querySelector("#result-area");
const expressionElem = resultArea.children[1];
const PrevExpressionElem = resultArea.children[0];
const historyTab = document.querySelector("#history-tab");
const clearHistoryBtn = historyTab.querySelector("#clear-all-calculations");
const sideBarMenus = document.querySelector("#calc-side-bar");
const sideBarMenuBtn = document.querySelector("#side-bar-menu-btn");
const toggleHistoryTabBtns = document.querySelectorAll(".toggle-history-tab");

// global array that contains all num and symbol
let expressionArr = [];
let prevExpressionArr = [];
let prevCalculations = [];

const getPreviousCalculation = () => {
  let prevCalcFromStorage = JSON.parse(localStorage.getItem("calculations"));
  if (!prevCalcFromStorage) {
    prevCalcFromStorage = [];
  }
  prevCalculations = prevCalcFromStorage;
};
getPreviousCalculation();

// click effect for buttons
const applyClickEffect = (btn) => {
  btn.classList.add("click-effect");

  setTimeout(() => {
    btn.classList.remove("click-effect");
  }, 500);
};

const showExpressionOnscreen = () => {
  expressionElem.innerHTML = getExpression(expressionArr);
  PrevExpressionElem.innerHTML = getExpression(prevExpressionArr);
};
// showExpressionOnscreen();

const isLastElemExit = () => {
  let lastElem = expressionArr[expressionArr.length - 1];
  if (
    lastElem === "%" ||
    lastElem === "/" ||
    lastElem === "+" ||
    lastElem === "-" ||
    lastElem === "." ||
    lastElem === "*"
  ) {
    return true;
  }
};

const getEvaluatedExpression = () => {
  let expression = "";
  for (let elem of expressionArr) {
    expression += elem;
  }
  prevExpressionArr = expressionArr;

  return eval(expression);
};

const reverseFromHistoryTab = ({ expression, result }) => {
  expressionArr = String(result).split(",");
  prevExpressionArr = expression;
  showExpressionOnscreen();
};

let animDelay = 0;
const applySwapAnimOnDelete = (elem) => {
  elem.classList.add("show-anim-on-clear");
  elem.style.animationDelay = animDelay + "s";
  animDelay += 0.2;
};

const deleteIndividualCalculation = ({ id }) => {
  const newPreCalculations = prevCalculations.filter(
    (calculation) => calculation.id !== id
  );
  prevCalculations = newPreCalculations;
  localStorage.setItem("calculations", JSON.stringify(prevCalculations));
  showPrevCalculationsOnHisTab();
};

const prevCalculationsElem = historyTab.querySelector(".prev-calculations");
showPrevCalculationsOnHisTab();
function showPrevCalculationsOnHisTab() {
  getPreviousCalculation();
  prevCalculationsElem.innerHTML = "";
  for (let calculation of prevCalculations.reverse()) {
    const prevCalculation = getPreviousCalcElem(calculation);

    // get individual previous calculation from history tab on double click
    prevCalculation.ondblclick = () => {
      reverseFromHistoryTab(calculation);
      const ctrlMenuElem = document.querySelector(".ctrl-menus");
      if (ctrlMenuElem) {
        ctrlMenuElem.remove();
      }
      applyClickEffect(prevCalculation);
      setTimeout(() => {
        toggleHistoryTab();
      }, 500);
    };

    // show copy and delete option on right click on individual calculation
    prevCalculation.oncontextmenu = (e) => {
      const ul = getControlMenus(e);
      prevCalculation.insertAdjacentElement("beforeend", ul);

      // copy and delete function on click
      Array.from(ul.children).forEach((menu) => {
        menu.addEventListener("click", () => {
          if (menu.dataset.btnType === "copy") {
            const selectElem = prevCalculation.querySelector(".that-result");
            copyResult(selectElem);
          } else {
            applySwapAnimOnDelete(prevCalculation);
            setTimeout(() => {
              deleteIndividualCalculation(calculation);
              animDelay = 0;
            }, animDelay * 1000);
          }
        });
      });

      setTimeout(() => {
        ul.remove();
      }, 2000);
    };

    // remove ctrl menus click on individual calculation
    prevCalculation.onclick = () => {
      const ctrlMenuElem = document.querySelector(".ctrl-menus");
      if (ctrlMenuElem) {
        ctrlMenuElem.remove();
      }
    };

    prevCalculationsElem.append(prevCalculation);
  }
}

// update previous calculations list after doing calculation
const updatePrevCalculation = (expression, result) => {
  const timeObj = getTimeObj();
  let obj = {};
  obj = { ...timeObj };
  obj.id = `calculation_${prevCalculations.length + 1}`;
  obj.expression = expression;
  obj.result = result;
  prevCalculations.push(obj);
  localStorage.setItem("calculations", JSON.stringify(prevCalculations));
  showPrevCalculationsOnHisTab();
};

// clear all previous calculations
const clearAllHistory = () => {
  prevCalculations = [];
  localStorage.setItem("calculations", JSON.stringify(prevCalculations));
  prevCalculationsElem.innerHTML = `
  <li class="flex">
  <p class="his-message">There's no history yet.</p>
  </li>`;
  showPrevCalculationsOnHisTab();
  setTimeout(() => {
    toggleHistoryTab();
  }, 500);
};
clearHistoryBtn.addEventListener("click", () => {
  const prevCalculationsList =
    prevCalculationsElem.querySelectorAll(".prev-calculation");
  for (let prevCalculationItem of Array.from(prevCalculationsList)) {
    applySwapAnimOnDelete(prevCalculationItem);
  }
  setTimeout(() => {
    clearAllHistory();
    animDelay = 0;
  }, animDelay * 1000);
  applyClickEffect(clearHistoryBtn);
});

// reverse from prevExpressionArr to expressionArr
PrevExpressionElem.addEventListener("dblclick", () => {
  if (prevExpressionArr[0] === "sqrt(") {
    expressionArr = prevExpressionArr.slice(1, prevExpressionArr.length - 1);
  } else {
    expressionArr = prevExpressionArr;
  }
  prevExpressionArr = [];
  showExpressionOnscreen();
});

// evaluate expression and update previous calculations list
const evalAndUpdatePrevCalc = () => {
  let evaluatedExpression = getEvaluatedExpression();
  updatePrevCalculation(prevExpressionArr, evaluatedExpression);
  expressionArr = [];
  for (let elem of String(evaluatedExpression)) {
    expressionArr.push(elem);
  }
};

// update express array after click on calculator buttons
const updateExpressionArr = (value) => {
  expressionElem.innerHTML = "";
  if (value === "clear") {
    expressionArr = [];
    prevExpressionArr = [];
  } else if (value === "ce") {
    expressionArr = [];
  } else if (value === "1/x") {
    if (expressionArr.length) {
      expressionArr = ["1", "/", "(", ...expressionArr, ")"];
      evalAndUpdatePrevCalc();
    }
  } else if (value === "xSquare") {
    if (expressionArr.length) {
      expressionArr = [
        "(",
        ...expressionArr,
        ")",
        "*",
        "(",
        ...expressionArr,
        ")",
      ];
      evalAndUpdatePrevCalc();
    }
  } else if (value === "rootX") {
    if (expressionArr.length) {
      let nums = "";
      for (let num of expressionArr) {
        nums += num;
      }
      let cal = Math.sqrt(+nums);
      prevExpressionArr = ["sqrt(", ...expressionArr, ")"];
      expressionArr = [cal];
      let timeObj = getTimeObj();
      prevCalculations = [
        {
          expression: prevExpressionArr,
          result: expressionArr,
          ...timeObj,
          id: `calculation_${prevCalculations.length + 1}`,
        },
        ...prevCalculations,
      ];
      showPrevCalculationsOnHisTab();
    }
  } else if (value === "plus-minus") {
    if (expressionArr[0] === "-(" || expressionArr[0] === "-") {
      expressionArr.shift();
      // expressionArr = [...expressionArr];
    } else {
      expressionArr = ["-(", ...expressionArr];
    }
  } else if (value === "backspace") {
    expressionArr.pop();
  } else if (
    value === "%" ||
    value === "/" ||
    value === "+" ||
    value === "-" ||
    value === "*"
  ) {
    if (!(!expressionArr.length || isLastElemExit())) {
      expressionArr.push(value);
    }
  } else if (value === "0") {
    if (expressionArr.length) {
      expressionArr.push(value);
    }
  } else if (value === ".") {
    if (!isLastElemExit()) {
      expressionArr.push(value);
    }
  } else if (value === "=") {
    if (!expressionArr.length) return;
    if (expressionArr[0] === "-(") {
      expressionArr[expressionArr.length] = ")";
    } else {
      if (expressionArr[expressionArr.length - 1] === ")") {
        expressionArr.pop();
      }
    }
    evalAndUpdatePrevCalc();
  } else {
    expressionArr.push(value);
  }
  showExpressionOnscreen();
};

calcBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let btnValue = e.currentTarget.dataset.value;
    updateExpressionArr(btnValue);
    applyClickEffect(btn);

    const audio = new Audio("./assets/click-sound.mp3");
    audio.play();
  });
});

// toggle side bar
const toggleSideBar = () => {
  sideBarMenus.parentElement.classList.toggle("toggle-side-bar");
};
sideBarMenuBtn.addEventListener("click", toggleSideBar);

// toggle history tab bar
const toggleHistoryTab = () => {
  historyTab.classList.toggle("toggle-history-tab");
};
toggleHistoryTabBtns.forEach((btn) => {
  btn.addEventListener("click", toggleHistoryTab);
});
