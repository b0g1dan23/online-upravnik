import { Component, Input } from '@angular/core';
import { Issue } from '../../../../store/tenant/tenant.model';
import { DatePipe, NgClass } from '@angular/common';
import { Card } from "../../../ui/card/card";

@Component({
  selector: 'app-single-issue',
  imports: [DatePipe, Card, NgClass],
  templateUrl: './single-issue.html',
})
export class SingleIssue {
  @Input({ required: true }) public issue!: Issue;
}
