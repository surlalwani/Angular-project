import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';

interface BarData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
})
export class BarComponent implements OnInit {
  @Input()
  data: BarData[] = [];

  private svg: any;
  private margin = 50;
  private width = 750 - this.margin * 2;
  private height = 400 - this.margin * 2;

  ngOnInit(): void {
    this.createSvg();
    this.drawBars();
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', `translate(${this.margin}, ${this.margin})`);
  }

  private drawBars(): void {
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Create the X-axis band scale
    const x = d3
      .scaleBand()
      .range([0, this.width])
      .domain(this.data.map((d) => d.label))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create the Y-axis linear scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.value) || 0])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append('g').call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg
      .selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', (d: { label: string }) => x(d.label) || 0)
      .attr('y', (d: { value: d3.NumberValue }) => y(d.value))
      .attr('width', x.bandwidth())
      .attr(
        'height',
        (d: { value: d3.NumberValue }) => this.height - y(d.value)
      )
      .attr('fill', (d: { value: number }) => {
        if (d.value > 450) {
          return 'green';
        } else if (d.value < 400) {
          return 'red';
        } else {
          return '#d04a35';
        }
      })
      .on('mouseover', (event: any, d: BarData) => {
        const [x, y] = d3.pointer(event);
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`<strong>${d.label}</strong><br/>Value: ${d.value}`)
          .style('left', `${x}px`)
          .style('top', `${y}px`);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });
  }
}
