import {Component, OnInit, ElementRef} from 'angular2/core';
import {Router} from 'angular2/router';
import {Wedge, DonutService} from "./donut.service";

function setHover(d, doSet) {
    d3.select(this).classed(d.id + "-hover", doSet)
}





@Component({
    selector: 'tw-donut',
    template: ``,
    styles: [``],
    providers: [ElementRef]
})
export class DonutComponent implements OnInit {
    private synth: any;
    private data: Array<Wedge>;
    private elementRef: ElementRef;
    private center;
    private pie;
    private svg;
    private locked: boolean;
    private width: number;
    private height: number;
    private transparentArcSize: number;
    private paddings: {
        pieSectorAngularPadding: number;
        backgroundPadding: number;
        pieAreaPadding: number;
    };
    private radii: {
        rSmall1: number;
        rSmall2: number;
        rSmallBullsEye: number;
    };

    constructor(elementRef: ElementRef, private _donutService: DonutService, private _router: Router) {
        this.elementRef = elementRef;
        this.locked = false;
        this.width = 225;
        this.height = 225;
        this.transparentArcSize = 70;
        this.paddings = {
            pieSectorAngularPadding: 2.5,
            backgroundPadding: 4,
            pieAreaPadding: 13
        };
        this.radii = {
            rSmall1: 40.5,
            rSmall2: 30.5,
            rSmallBullsEye: 20.5
        };
        this.synth = new Tone.MonoSynth({
            "filter" : {
                "type" : "lowpass",
                "Q" : 7
            },
            "filterEnvelope" : {
                "attack" : 0.02,
                "decay" : 0.1,
                "sustain" : 0.2,
                "release" : 0.9,
            }
        }).toMaster();
    }

    arcTween(d) {
        let interpolate = d3.interpolate(
            [d.startAngle[0], d.endAngle[0]],
            [d.startAngle[1], d.endAngle[1]]
        );

        let arc = function (start, end, or) {
            return d3.svg.arc()
                .innerRadius(0)
                .outerRadius(or)
                .startAngle(start)
                .endAngle(end)();
        };

        return (t) => {
            return arc(interpolate(t)[0], interpolate(t)[1], this.center.x - this.paddings.pieAreaPadding);
        }
    }

    redraw() {
        if (!this.pie) return;

        let degsToRadians = d3.scale.linear().domain([0, 360]).range([0, 2 * Math.PI]);

        let paddings = this.data.length * this.paddings.pieSectorAngularPadding;
        let pieSectorAngularSize = (360 - paddings) / this.data.length;

        let ctx = this;

        this.data = this.data.map(function (d, i) {
            let startAngle = degsToRadians(pieSectorAngularSize * i + ctx.paddings.pieSectorAngularPadding * (i + 1)),
                endAngle = degsToRadians(pieSectorAngularSize) + startAngle,
            /* Angle for enter selection */
                enterAngle = (endAngle - startAngle) / 2 + startAngle;

            return {
                id: d.id,
                text: d.text,
                startAngle: [d.startAngle ? d.startAngle[1] : enterAngle, startAngle],
                endAngle: [d.endAngle ? d.endAngle[1] : enterAngle, endAngle],
                d: d3.svg.arc()
                    .innerRadius(0)
                    .outerRadius(ctx.center.x - ctx.paddings.pieAreaPadding)
                    .startAngle(startAngle)
                    .endAngle(endAngle)(),
                note: d.note
            };
        });

        let pieSectors = this.pie.selectAll("path")
            .data(ctx.data, function (d) {
                return d.id
            });

        /* Enter */
        pieSectors.enter()
            .insert("path")
            .attr("class", function (d) {
                return d.id
            })
            .on("click", (d, i) => {
                this.click(this.pie, d, i)
            })
            .on("dblclick", function (d, i) {
                ctx.dblclick.call(this, ctx.pie, d)
            })
            .on("mouseover", function (d, i) {
                ctx.mouseover.call(this, ctx.pie, d, i)
            })
            .on("mouseout", function (d, i) {
                ctx.mouseout.call(this, ctx.pie, d)
            })
            .on("touchstart", function (d, i) {
                ctx.touchstart.call(this, ctx.pie, d)
            })
            .on("touchmove", function (d, i) {
                ctx.touchmove.call(this, ctx.pie, d, i)
            })
            .on("touchend", function (d, i) {
                ctx.touchend.call(this, ctx.pie, d)
            })
            .on("touchcancel", function (d, i) {
                ctx.touchcancel.call(this, ctx.pie, d)
            })

            /* Entering... */

            .transition()
            .duration(500)
            .attrTween("d", function (d, i, a) {
                return ctx.arcTween(d);
            });

        /* Update */
        pieSectors.transition()
            .duration(500)
            .attrTween("d", function (d, i, a) {
                return ctx.arcTween(d);
            });

        /* Exit */
        pieSectors.exit()
            .transition()
            .duration(500)
            .attrTween("d", function (d, i, a) {
                let delta = d.endAngle[1] - d.startAngle[1];

                d.startAngle = d3.permute(d.startAngle, [1, 0]);
                d.endAngle = d3.permute(d.endAngle, [1, 0]);

                d.startAngle[1] = d.startAngle[0] + delta / 2;
                d.endAngle[1] = d.endAngle[0] - delta / 2;

                return ctx.arcTween(d);
            }).remove();
    }

    paintTo(selector) {
        this.svg = d3.select(selector)
            .append("svg")
            .attr("width", this.width + 5)
            .attr("height", this.height + 5);

        let ctx = this;

        this.center = {x: ctx.width / 2, y: ctx.height / 2};

        let grad = this.svg
            .append("defs")
            .append("radialGradient")
            .attr("id", "grad-inner-grey")
            .attr("cx", ".5")
            .attr("cy", ".5")
            .attr("r", ".73");

        grad.append("stop")
            .attr("offset", ".01")
            .attr("stop-color", "#fff")
            .attr("stop-opacity", "1");

        grad.append("stop")
            .attr("offset", ".77")
            .attr("stop-color", "#aaa")
            .attr("stop-opacity", "1");

        let g = this.svg
            .append("g");

        let ctx = this;

        /* Inner black background */
        g.append("g")
            .append("circle")
            .attr("cx", ctx.center.x)
            .attr("cy", ctx.center.y)
            .attr("r", ctx.center.x - this.paddings.backgroundPadding)
            .style("fill", "rgba(56,56,58,.9)");

        this.pie = g.append("g").attr("transform", "translate(" + ctx.center.x + "," + ctx.center.y + ")").append("g");

        this.redraw();

        /* Transparent arc path generator */
        var outerArc = d3.svg.arc()
            // Percentage of width (70% by default)
            .innerRadius(d3.scale.linear().domain([0, 100]).range([0, ctx.center.x])(this.transparentArcSize))
            .outerRadius(ctx.center.x)
            .startAngle(0)
            .endAngle(2 * Math.PI);

        g.append("path")
            .attr("transform", "translate(" + ctx.center.x + "," + ctx.center.y + ")")
            .attr("d", outerArc)
            .style("fill", "rgba(0,0,0,.1)")
            .style("pointer-events", "none");

        /* Small inner circle 1 */
        g.append("g")
            .append("circle")
            .attr("cx", ctx.center.x)
            .attr("cy", ctx.center.y)
            .attr("r", ctx.radii.rSmall1)
            .style("fill", "#E4E4E4");

        /* Small inner circle 2 */
        g.append("g")
            .append("circle")
            .attr("cx", ctx.center.x)
            .attr("cy", ctx.center.y)
            .attr("r", ctx.radii.rSmall2)
            .style("fill", "url(#grad-inner-grey)");

        /* Small inner circle 3 (bullseye) */
        g.append("g")
            .append("circle")
            .attr("cx", ctx.center.x)
            .attr("cy", ctx.center.y)
            .attr("r", ctx.radii.rSmallBullsEye)
            .style("fill", "rgba(67,72,77,.9)");

        return this;
    }

    setData(data) {

        // var self = this;

        let oldData = this.data;
        this.data = data;

        console.dir(this.data);

        this.data.forEach((d, i, a) => {
            oldData.forEach((d2, i2, a2) => {
                if (d.id === d2.id)
                    this.data[i] = oldData[i2];
            });
        });

        this.redraw();
        return this;
    }

    selectByClass(className) {

        if (!this.pie) return this;

        this.pie.selectAll("path").classed("pie-selected", function (d) {
            return d.id === className;
        });

        return this;
    }

    getData() {
        this.data = [];
        console.trace();
        let ctx = this;
        this._donutService.getWedges().then(function (wedges) {
            console.dir(wedges);
            ctx.data = wedges;
            ctx.redraw();
        });
        return this.data;
    }

    mouseover(pie, d) {
        return setHover.call(this, d, !('ontouchstart' in window))
    }

    mouseout(pie, d) {
        return setHover.call(this, d, false)
    }

    click(pie, d, i) {
        this.selectByClass(d.id);
        this.synth.triggerAttack(d.note, "+1");

        let radsToDegs = d3.scale.linear().domain([0, 2 * Math.PI]).range([0, 360]);

        let a = (d.endAngle[1] - d.startAngle[1]) / 2;

        a = 180 - radsToDegs(a) - radsToDegs(d.startAngle[1]);

        console.log(a);

        pie.transition()
            .duration(1000)
            .attr("transform", "rotate(" + a + ")");
    }

    dblclick(pie, d) {
        let localData = Object.create(this.data);
        if (!this.locked) {
            if (localData.length == 5)
                localData.push({id: "pie-6", text: ""});
            else if (this.data.length == 6)
                localData.pop();
            this.setData(localData);
            this.locked = true;
            setTimeout(() => {
                this.locked = false
            }, 500);

        }
    }

    touchstart(pie, d) {
        return setHover.call(this, d, true)
    }

    touchmove(svg, data, i) {
    }

    touchend(pie, d) {
        return setHover.call(this, d, false)
    }

    touchcancel(pie, d) {
        return setHover.call(this, d, false)
    }

    ngOnInit() {
        this.getData();
    }

    ngAfterViewInit() {
        this.paintTo(this.elementRef.nativeElement).selectByClass("pie-1");
    }

}
