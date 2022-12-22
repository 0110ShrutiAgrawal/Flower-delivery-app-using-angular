import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flower-card',
  templateUrl: './flower-card.component.html',
  styleUrls: ['./flower-card.component.scss']
})
export class FlowerCardComponent implements OnInit {

  @Input() public flowerName;
  @Input() public flowerThumbnail;
  @Input() public flowerImage;
  @Input() public colors;
  @Input() public rating;
  @Input() public review;

  public math = Math;

  constructor() { }

  ngOnInit(): void {
  }

}
