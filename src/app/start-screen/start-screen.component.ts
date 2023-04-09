import { Component, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Game } from 'src/models/game';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  firestore: Firestore = inject(Firestore);

  constructor(private router: Router) {}

  ngOnInit(): void {
    
  }

  //Start game
  async newGame() {
    let game = new Game;
    const gameCollection = collection(this.firestore, 'games');
    let gameInfo = await addDoc(gameCollection, game.toJson());
    this.router.navigateByUrl('/game/' + gameInfo['id']);
  }
}
