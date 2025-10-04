import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { SingleIssue } from "./single-issue/single-issue";
import { Store } from '@ngrx/store';
import { selectAllIssues, selectIssuesHasMorePages, selectIssuesLoading, selectSelectedIssue } from '../../../store/manager/manager.selectors';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { ManagerActions } from '../../../store/manager/manager.actions';
import { BehaviorSubject, combineLatest, delay, filter, Subject, take, takeUntil } from 'rxjs';
import { Modal } from "../../ui/modal/modal";
import { Button } from "../../ui/button/button";

@Component({
  selector: 'app-all-issues',
  imports: [SingleIssue, AsyncPipe, Modal, DatePipe, Button, NgClass],
  templateUrl: './all-issues.html',
})
export class AllIssues implements OnInit, OnDestroy {
  private store = inject(Store);
  private showModal$ = new BehaviorSubject(false);
  public showModal = this.showModal$.asObservable();
  private destroy$ = new Subject<void>();
  private scrollTrigger = viewChild<ElementRef>('scrollTrigger');
  private observer?: IntersectionObserver;
  issues$ = this.store.select(selectAllIssues);
  selectedIssue$ = this.store.select(selectSelectedIssue);
  hasMorePages$ = this.store.select(selectIssuesHasMorePages);
  loadingMoreIssues$ = this.store.select(selectIssuesLoading);

  constructor() { }

  private setupInfiniteScroll() {
    const trigger = this.scrollTrigger();
    if (!trigger) return;

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          combineLatest([
            this.hasMorePages$,
            this.loadingMoreIssues$
          ]).pipe(
            filter(([hasMore, loading]) => hasMore && !loading),
            takeUntil(this.destroy$),
          ).subscribe(() => {
            this.loadMoreIssues();
          });
        }
      })
    }, {
      rootMargin: '100px',
      threshold: 0.1
    })

    this.observer.observe(trigger.nativeElement);
  }

  ngOnDestroy(): void {
    this.store.dispatch(ManagerActions['[Issue]ResetIssues']());
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.store.dispatch(ManagerActions['[Issue]LoadIssues']());

    this.issues$.pipe(
      filter(issues => issues.length > 0),
      delay(100),
      take(1)
    ).subscribe(() => {
      this.setupInfiniteScroll();
    });
  }

  showIssueDetails(issueID: string) {
    this.store.dispatch(ManagerActions['[Issue]LoadIssueByID']({ issueID }));
    this.toggleModal();
  }

  loadMoreIssues() {
    this.store.dispatch(ManagerActions['[Issue]LoadIssues']());
  }

  toggleModal() {
    this.showModal$.next(!this.showModal$.value);
  }
}
