import { Component, Output, EventEmitter } from '@angular/core';
import { Button } from "../button/button";
import { Card } from "../card/card";
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  imports: [Button, Card, LucideAngularModule],
  templateUrl: './modal.html',
})
export class Modal {
  readonly X = X;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
