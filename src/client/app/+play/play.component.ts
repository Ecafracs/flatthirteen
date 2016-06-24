import { Component } from '@angular/core';

/**
 * This class represents the lazy loaded PlayComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-play',
  templateUrl: 'play.component.html',
  styleUrls: ['play.component.css']
})
export class PlayComponent {
  audioContext: AudioContext;
  currentOscillator: OscillatorNode;
  constructor() {
    this.audioContext = new AudioContext();
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
    this.currentOscillator.stop(0);
  }
}
