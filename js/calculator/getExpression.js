export const getExpression = (expressionArr) => {
  let expressionHTML = "";
  for (let elem of expressionArr) {
    switch (elem) {
      case "+":
        elem = `&ThinSpace;<i class="fa-solid fa-plus fa-xs"></i>&ThinSpace;`;
        break;
      case "-":
        elem = `&ThinSpace;<i class="fa-solid fa-minus fa-xs"></i>&ThinSpace;`;
        break;
      case "*":
        elem = `&ThinSpace;<i class="fa-solid fa-xmark fa-xs"></i>&ThinSpace;`;
        break;
      case "/":
        elem = `&ThinSpace;<i class="fa-solid fa-divide fa-xs"></i>&ThinSpace;`;
        break;
      case "%":
        elem = `&ThinSpace;<i class="fa-solid fa-percentage fa-xs"></i>&ThinSpace;`;
        break;
      case ".":
        elem = `&ThinSpace;<i class="fa-solid fa-circle"></i>&ThinSpace;`;
        break;
    }
    expressionHTML += `<span>${elem}</span>`;
  }
  return expressionHTML;
};
