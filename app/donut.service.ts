import {Injectable} from 'angular2/core';
import {WEDGES} from './donut-data';

export interface Wedge {
    id: string;
    text: string;
    startAngle?;
    endAngle?;
    d?;
    note?: string;
}

@Injectable()
export class DonutService {
    getWedges() {
        return Promise.resolve(WEDGES);
    }

    getWedge(id: number) {
        return Promise.resolve(WEDGES).then(
            wedges => wedges.filter(w => w.id == id)[0]
        );
    }
}