import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-pps-bar',
  templateUrl: './list-pps-bar.component.html',
  styleUrls: ['./list-pps-bar.component.scss'],
})
export class ListPpsBarComponent implements OnInit {
  constructor() {}

  @Input() childrenTabName : string;

  ngOnInit(): void {}
}
