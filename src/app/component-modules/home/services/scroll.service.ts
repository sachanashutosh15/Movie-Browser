import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private remainingScroll$ = new BehaviorSubject<number>(100);

  private calculateRemainingScroll(element: HTMLElement) {
    const totalHeight = element.scrollHeight;
    const viewportHeight = element.clientHeight;
    const scrollTop = element.scrollTop;
    const remainingScrollPx = totalHeight - viewportHeight - scrollTop;
    const remainingScrollPercent =
      (remainingScrollPx / (totalHeight - viewportHeight)) * 100;

    this.remainingScroll$.next(remainingScrollPercent);
  }

  setScrollElement(elementRef: ElementRef) {
    const element = elementRef.nativeElement;
    fromEvent(element, 'scroll')
      .pipe(throttleTime(100))
      .subscribe(() => this.calculateRemainingScroll(element));
  }

  getRemainingScroll() {
    return this.remainingScroll$.asObservable();
  }
}
