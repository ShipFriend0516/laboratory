import { throttle } from "../utils/performance";

const dragStartHandler = (e: DragEvent) => {
  const draggedItem = e.target as HTMLElement;
  if (draggedItem) {
    draggedItem.classList.add("place");
    e.dataTransfer?.setData("text/plain", draggedItem.dataset.id || "");
  }
};

const dragEndHandler = (e: DragEvent) => {
  const draggedItem = e.target as HTMLElement;
  if (draggedItem) {
    draggedItem.classList.remove("place");
  }
};

const dragOverHandler = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  throttledDragOver(e);
};

const throttledDragOver = throttle((e: DragEvent) => {
  const target = e.target as HTMLElement;
  const closest = target.closest(".drop-zone");
  if (closest) {
    const elements = [...closest.querySelectorAll(".item")] as HTMLElement[];
    const index = findIndex(elements, e.y);
    console.log(index);
    const preview = document.querySelector(".place") as HTMLElement;

    // 미리보기 넣기
    if (preview instanceof HTMLElement) {
      if (elements.length - 1 === index) {
        closest.appendChild(preview);
      } else {
        closest.insertBefore(preview, closest.children[index] || null);
      }
    }
  }
}, 16);

const dropHandler = (e: DragEvent) => {
  e.preventDefault();
  const target = e.target as HTMLElement;
  if (target) {
    const closest = target.closest(".drop-zone") as HTMLElement;
    const item = document.querySelector(
      `.item[data-id="${e.dataTransfer?.getData("text/plain")}"]`
    ) as HTMLElement;

    if (closest) {
      const index = findIndex([...closest.children] as HTMLElement[], e.y);
      console.log(index);
      if (index === 0) {
        closest.insertBefore(item, (closest.firstElementChild as HTMLElement) || null);
      } else {
        closest.insertBefore(item, (closest.children[index] as HTMLElement) || null);
      }
    }
  }
};

const findIndex = (elements: HTMLElement[], yPos: number) => {
  // elements 들 중 yPOS가 몇번째 인덱스
  const rects = elements.map((element) => {
    const rect = element.getBoundingClientRect();
    const center = rect.top + (rect.bottom - rect.top) / 2;
    return center;
  });
  const index = rects.findIndex((rect) => rect >= yPos);

  return index === -1 ? rects.length - 1 : index;
};

export { dragStartHandler, dragEndHandler, dragOverHandler, dropHandler };
