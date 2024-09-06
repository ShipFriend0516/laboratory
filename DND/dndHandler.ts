const dragStartHandler = (e: DragEvent) => {
  const draggedItem = e.target;
  if (draggedItem) {
    draggedItem.classList.add("place");
  }
};

export { dragStartHandler };
