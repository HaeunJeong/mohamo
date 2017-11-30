import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetTodoPage } from './set-todo';

@NgModule({
  declarations: [
    SetTodoPage,
  ],
  imports: [
    IonicPageModule.forChild(SetTodoPage),
  ],
})
export class SetTodoPageModule {}
