// get control menus element
export const getControlMenus = (e) => {
  e.preventDefault();
  const ctrlMenuElem = document.querySelector(".ctrl-menus");
  if (ctrlMenuElem) {
    ctrlMenuElem.remove();
  }
  const ul = document.createElement("ul");
  ul.className = "ctrl-menus";
  ul.innerHTML = `
    <li class="ctrl-menu" data-btn-type="copy">
      <i class="fa-solid fa-copy"></i>
      <span>copy</span>
    </li>
    <li class="ctrl-menu" data-btn-type="delete">
      <i class="fa-solid fa-trash-alt"></i>
      <span>delete</span>
    </li>
  `;
  let x = e.offsetX,
    y = e.offsetY;
  let xDistance = e.currentTarget.clientWidth - x >= 90;
  ul.style.left = (xDistance ? x : x - 90) + "px";
  ul.style.top = y + "px";
  return ul;
};
