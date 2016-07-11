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

  private content: number;
  private sub: any;

  private rowCount: number;
  private rowRange: any;
  private columnCount: number;
  private columnRange: any;

  constructor(
    private router: Router) {
    this.audioContext = new AudioContext();
    
    this.rowCount = 3;
    this.rowRange = Array;
    this.columnCount = 3;
    this.columnRange = Array;
  }

  ngOnInit() {
    var rowCount: number;
    var columnCount: number;

    this.sub = this.router
      .routerState
      .queryParams
      .subscribe(params => {
        this.content = +params['content'];
        rowCount = +params['N'];
        columnCount = +params['P'];
      });

    console.log("rowCount: " + rowCount);
    if (isNaN(rowCount) !== true) {
      this.rowCount = rowCount;
    }

    console.log("columnCount: " + columnCount);
    if (isNaN(columnCount) !== true) {
      this.columnCount = columnCount;
    }

    console.log("Content: " + this.content.toString());
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
}
