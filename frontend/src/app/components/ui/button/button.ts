import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
})
export class Button {
  type = input<HTMLButtonElement['type']>('button');
  disabled = input<boolean>(false);
}
