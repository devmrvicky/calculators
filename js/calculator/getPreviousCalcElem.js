import { getExpression } from "./getExpression.js";

export const getPreviousCalcElem = (calculation) => {
  const prevCalculation = document.createElement("li");
  prevCalculation.className = "prev-calculation flex";
  prevCalculation.setAttribute("data-id", calculation.id);
  prevCalculation.innerHTML = `
  <div>
    <p class="expression">${getExpression(calculation.expression)}</p>
    <p class="that-result">${calculation.result}</p>
  </div>
  <div class="calculation-date flex">
    <span>${calculation.time}</span>
    <span>${calculation.date}</span>
  </div>
  `;
  return prevCalculation;
};
