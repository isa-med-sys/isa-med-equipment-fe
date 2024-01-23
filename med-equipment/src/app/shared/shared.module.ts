import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePopupComponent } from './image-popup/image-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    ImagePopupComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  exports: [
    ImagePopupComponent
  ]
})
export class SharedModule { }