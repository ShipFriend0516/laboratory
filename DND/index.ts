import { dragStartHandler, dragEndHandler, dropHandler, dragOverHandler } from "./dndHandler";

document.addEventListener("dragstart", dragStartHandler);
document.addEventListener("dragend", dragEndHandler);
document.addEventListener("dragover", dragOverHandler);
document.addEventListener("drop", dropHandler);

const interval = setInterval(() => {
  console.log("interval");
}, 1000);
