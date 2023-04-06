import { DialogAddPlayerComponent } from './../dialog-add-player/dialog-add-player.component';
import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game;
  games$: Observable<any>;
  firestore: Firestore = inject(Firestore);
  games: Array<any>;
  gameId: string;
  gameCollection: any;
  gameOver = false;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    //Gets the data from the Firebase. To get the data finally, they still have to be subscribed
    this.gameCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(this.gameCollection);
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.setGameData(params);


      //Show in the console what state our database is currently in. 
      //Is a continuation of the commands from the two lines of code from the constructor
      this.games$.subscribe((newGames) => {
        this.games = newGames;
      });
    });
  }

  setGameData(params) {
    this.gameId = params['id'];
    let docRef = doc(this.gameCollection, this.gameId);
    let game$ = docData(docRef);
    game$.subscribe((game: any) => {
      this.game.currentPlayer = game.currentPlayer;
      this.game.playedCards = game.playedCards;
      this.game.players = game.players;
      this.game.player_images = game.player_images;
      this.game.stack = game.stack;
      this.game.pickCardAnimation = game.pickCardAnimation;
      this.game.currentCard = game.currentCard;
      //this.game.player_images = game.player_images;
    });
    // if(this.game.stack.length == 0 && this.counter == 0) {
    //   this.counter++;
    // }
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if(this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation && this.game.players.length >= 1) {
      this.addCardToCurrentCardAndPlayAnimation();
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    } else {
      alert('Please add at least one player!');
    }
  }

  addCardToCurrentCardAndPlayAnimation() {
    this.game.currentCard = this.game.stack.pop();
    this.game.pickCardAnimation = true;
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if(change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.player_images.splice(playerId, 1);
        } else {
          this.game.player_images[playerId] = change;
        }
        this.saveGame();
      }
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      //the 'name' in the if condition checks if 'name' exists and also checks if 'name' has a length greater than zero
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('0.svg');
        this.saveGame();
      }
    });
  }

  saveGame() {
    let gameCollection = collection(this.firestore, 'games');
    let docInstance = doc(gameCollection, this.gameId);
    setDoc(docInstance, this.game.toJson());
  }
}


