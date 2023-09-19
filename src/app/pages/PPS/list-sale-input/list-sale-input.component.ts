import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-sale-input',
  templateUrl: './list-sale-input.component.html',
  styleUrls: ['./list-sale-input.component.css']
})
export class ListSaleInputComponent implements OnInit {

  @Input() childrenTabName : string;

  constructor() { }

  ngOnInit(): void {
  }

}
