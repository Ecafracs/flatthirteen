/// <reference path="../../../third_party/Tone.d.ts"/>

import { Component, OnInit, } from '@angular/core';

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

  kick: Tone.MembraneSynth;
  snare: Tone.NoiseSynth;
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
    this.gridState = [];
    for (let i = 0; i < this.numStrips; i++) {
      let strip: number[] = [];
      for (let j = 0; j < this.numBeats; j++) {
        strip.push(0);
      }
      this.gridState.push(strip);
    }
    this.kick = new Tone.MembraneSynth();
    let kickEffect = new Tone.Distortion(0.8).toMaster();
    this.kick.connect(kickEffect);

    this.snare = new Tone.NoiseSynth({type: 'white'});
    let snareEffect = new Tone.BitCrusher(1).toMaster();
    this.snare.connect(snareEffect);
  }

  setBeatState(stripIndex: number, beatIndex: number) {
    this.gridState[stripIndex][beatIndex] =
      this.gridState[stripIndex][beatIndex] ? 0 : 1;
    if (this.gridState[stripIndex][beatIndex]) {
      // Trigger sound for now.  Remove when looping transport works.
      if (stripIndex) {
        this.kick.triggerAttackRelease("G0", "8n");
      } else {
        this.snare.triggerAttackRelease("4n");
      }
    }
  }

  getBeatStateClass(state: number) {
    return 'state' + state;
  }

}
