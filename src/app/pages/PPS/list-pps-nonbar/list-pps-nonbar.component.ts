import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-pps-nonbar',
  templateUrl: './list-pps-nonbar.component.html',
  styleUrls: ['./list-pps-nonbar.component.scss'],
})
export class ListPpsNonbarComponent implements OnInit {
  constructor() {}

  @Input() childrenTabName : string;

  ngOnInit(): void {}
}
