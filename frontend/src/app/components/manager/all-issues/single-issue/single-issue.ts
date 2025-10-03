import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Issue } from '../../../../store/tenant/tenant.model';
import { DatePipe, NgClass } from '@angular/common';
import { Card } from "../../../ui/card/card";
import { Button } from "../../../ui/button/button";

@Component({
  selector: 'app-single-issue',
  imports: [DatePipe, Card, NgClass, Button],
  templateUrl: './single-issue.html',
})
export class SingleIssue {
  @Input({ required: true }) public issue!: Issue;
  @Input({ required: false }) public canLoadDetails = false;
  @Output() showIssueDetails = new EventEmitter<string>();

  constructor() { }

  showDetails() {
    if (this.canLoadDetails) {
      this.showIssueDetails.emit(this.issue.id);
    }
  }
}
