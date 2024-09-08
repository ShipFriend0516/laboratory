# 드래그앤드랍 성능최적화
드래그앤드랍 성능최적화 기법 비교를 위해 만든 리포지토리

브랜치별로 다른 최적화 기법 사용
- beforeOptimize: 최적화 전
- performance/drag1 = `throttle`
- performance/drag2 = `requestAnimationFrame`

1. throttle
   - 일정 시간 간격을 두고 이벤트 핸들러가 실행되도록 제한하는 방법
   - 임의로 시간 간격을 정할 수 있다는 점이 장점이다.
   - 시간 간격이 16ms 보다 커질 경우 성능은 좋아지지만 애니메이션이 버벅거릴 수 있다.
2. requestAnimationFrame
   - 브라우저 최적화로 최적의 타이밍에 콜백을 실행한다.
   - 사용자의 주사율에 맞게 실행된다. 60hz는 60번
   - 백그라운드에서는 멈춰서 에너지를 절약한다.
  