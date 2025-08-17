import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class Button {
  type = input<HTMLButtonElement['type']>('button');
  disabled = input<boolean>(false);
}
