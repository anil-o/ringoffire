import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent implements OnInit {
name: string = '';

constructor(private dialogRef: MatDialogRef<DialogAddPlayerComponent>) { }

ngOnInit(): void {
  
}

onNoClick() {
  this.dialogRef.close();
}

}
