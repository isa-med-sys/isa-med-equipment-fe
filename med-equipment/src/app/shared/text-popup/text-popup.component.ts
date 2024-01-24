import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-text-popup',
  template: `
    <h2>Description</h2>
    <p>{{ data.description }}</p>
  `
})
export class TextPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  closeDialog(): void {
  }
}
