import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

/**
 * This class represents the lazy loaded PlayComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-play',
  templateUrl: 'play.component.html',
  styleUrls: ['play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy{
  audioContext: AudioContext;
  currentOscillator: OscillatorNode;

  private sub: any;

  private rowCount: number;
  private rowRange: any;
  private columnCount: number;
  private columnRange: any;

  private noteCountMax: number;
  private notesPerColumnMax: number;
  private noteCount: number;

  private noteStatuses: Array<string>;

  constructor(
    private router: Router) {
    this.audioContext = new AudioContext();
    
    this.rowCount = 3;
    this.rowRange = Array;
    this.columnCount = 3;
    this.columnRange = Array;

    this.noteCountMax = 3;
    this.notesPerColumnMax = 2;
  }

  ngOnInit() {
    var rowCount: number;
    var columnCount: number;
    var noteCountMax: number;
    var notesPerColumnMax: number;

    this.sub = this.router
      .routerState
      .queryParams
      .subscribe(params => {
        rowCount = +params['N'];
        columnCount = +params['B'];
        noteCountMax = +params['X'];
        notesPerColumnMax = +params['P'];
      });

    console.log("rowCount: " + rowCount);
    if (isNaN(rowCount) !== true) {
      this.rowCount = rowCount;
    }

    console.log("columnCount: " + columnCount);
    if (isNaN(columnCount) !== true) {
      this.columnCount = columnCount;
    }

    console.log("noteCountMax: " + noteCountMax);
    if (isNaN(noteCountMax) !== true) {
      this.noteCountMax = noteCountMax;
    }

    console.log("notesPerColumnMax: " + notesPerColumnMax);
    if (isNaN(notesPerColumnMax) !== true) {
      this.notesPerColumnMax = notesPerColumnMax;
    }

    this.generateBoxStatus();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  generateBoxStatus() {
    //start everything as "off"
    this.noteStatuses = new Array<string>(this.rowCount * this.columnCount); 
    for (let index = 0; index < this.noteStatuses.length; index++) {
      this.noteStatuses[index] = "off";
    }

    let m = Math.max(3, this.noteCountMax - 3);
    let n = Math.max(m, this.noteCountMax);
    let noteCount = Math.floor(Math.random() * (n - m + 1) + m);
    let possibleNoteCount = this.columnCount * this.notesPerColumnMax;
    noteCount = Math.min(noteCount, possibleNoteCount);
    this.noteCount = noteCount;
    console.log("noteCount: " + noteCount);

    let notesInColumn = new Array<number>(this.columnCount);
    for (let i = 0; i < notesInColumn.length; i++) {
      notesInColumn[i] = 0;
    }

    //first column always have a note
    //select one randomly
    let randomNoteInFirstColumn = Math.floor(Math.random() * this.rowCount);
    this.noteStatuses[randomNoteInFirstColumn * this.columnCount] = "on";
    notesInColumn[0] = 1;
    noteCount--;
    
    while (noteCount > 0) {
      let column = Math.floor(Math.random() * this.columnCount);
      if (notesInColumn[column] < this.notesPerColumnMax) {
        let randomNoteInColumn = Math.floor(Math.random() * this.rowCount);
        let noteIndex = randomNoteInColumn * this.columnCount + column;
        if (this.noteStatuses[noteIndex] === "on") {
          continue;
        }
        this.noteStatuses[noteIndex] = "on";
        notesInColumn[column]++;
        noteCount--;
      }
    }

    console.log("generateBoxStatus() done");

  }

  startNote(frequency: number) {
    console.log("startNote()");
    var oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(this.audioContext.destination);
    oscillator.start(0);
    this.currentOscillator = oscillator;
  }

  stopNote() {
    console.log("stopNote()");
    if (this.currentOscillator !== undefined)
    {
        this.currentOscillator.stop(0);
    }
    
  }

  getBoxColor(index: number) {
    if (this.noteStatuses[index] === "on"){
      return "rgb(0,150,0)";
    }
    else {
      return "rgb(100,100,100)";
    }
  }
}
