const throttle = (func: (...args: any[]) => void, gapTime: number) => {
  // func 지연할 함수, gapTime 지연시간 간격
  let lastTime: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (lastTime) return;
    lastTime = setTimeout(() => {
      func(...args);
      lastTime = null;
    }, gapTime);
  };
};
export { throttle };
