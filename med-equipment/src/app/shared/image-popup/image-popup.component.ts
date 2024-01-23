import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-popup',
  template: `
    <img [src]="data.image" alt="Image">
  `,
})
export class ImagePopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { image: string }) { }
}
