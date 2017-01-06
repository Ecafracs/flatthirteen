import { Component, OnInit } from '@angular/core';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {

  numStrips: number = 2;
  numBeats: number = 4;
  gridState: number[][];

  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
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
  }

  setBeatState(stripIndex: number, beatIndex: number) {
    this.gridState[stripIndex][beatIndex] =
      this.gridState[stripIndex][beatIndex] ? 0 : 1;
  }

  getBeatStateClass(state: number) {
    return 'state' + state;
  }
}
