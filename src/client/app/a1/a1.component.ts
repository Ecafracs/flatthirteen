/// <reference path="../../../third_party/Tone.d.ts"/>

import { Component, OnInit, } from '@angular/core';
import { Instrument, KickInstrument, SnareInstrument} from '../shared/instruments/instrument';

const livePlayWithin: number = 0.3;

/**
 * This class represents the lazy loaded A1Component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-a1',
  templateUrl: 'a1.component.html',
  styleUrls: ['a1.component.css'],
})
export class A1Component implements OnInit {
  gridLoop: Tone.Loop;
  noteLoop: Tone.Loop;
  kick: Instrument;
  snare: Instrument;
  iterations: number = 0;
  beat: number = 0;
  lastDelay: number = 0;
  numStrips: number = 2;
  numBeats: number = 4;
  gridState: number[][];

  /**
   * Creates an instance of the A1Component.
   */
  constructor() {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.kick = new KickInstrument();
    this.snare = new SnareInstrument();
    this.gridState = [];
    for (let i = 0; i < this.numStrips; i++) {
      let strip: number[] = [];
      for (let j = 0; j < this.numBeats; j++) {
        strip.push(0);
      }
      this.gridState.push(strip);
    }

    this.gridLoop = new Tone.Loop((time) => {
      this.iterations++;
      this.beat = 0;
    }, '1m');
    this.gridLoop.start(0);

    this.noteLoop = new Tone.Loop((time) => {
      if (this.gridState[0][this.beat]) {
        this.snare.play();
      }
      if (this.gridState[1][this.beat]) {
        this.kick.play();
      }
      this.beat++;
    }, '4n');
    this.noteLoop.start(0);

    Tone.Transport.start();

    function draw() {
      requestAnimationFrame(draw);
    }
    draw();
  }

  setBeatState(stripIndex: number, beatIndex: number) {
    this.gridState[stripIndex][beatIndex] =
      this.gridState[stripIndex][beatIndex] ? 0 : 1;
    if (this.gridState[stripIndex][beatIndex]) {
      // Trigger sound only if current beat and within livePlayWithin.
      if (beatIndex === this.beat - 1) {
        this.lastDelay = this.noteLoop.progress;
        if (beatIndex === this.beat - 1 && this.noteLoop.progress < livePlayWithin) {
          if (stripIndex) {
            this.kick.play();
          } else {
            this.snare.play();
          }
        }
      } else {
        this.lastDelay = 0;
      }
    }
  }
}
