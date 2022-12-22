import { Component, OnInit } from '@angular/core';
import {FlowerService } from '../../services/flower.service';
import { Router } from '@angular/router';
import { ISortOption } from '../../models/sort-option';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-flowers',
  templateUrl: './flowers.component.html',
  styleUrls: ['./flowers.component.scss']
})
export class FlowersComponent implements OnInit {
  
  public flowers = [];
  public flowersConstant = [];
  public userName = '';

  sortOptions: ISortOption[] = [
    {value: 'name', viewValue: 'Name'},
    {value: 'rating', viewValue: 'Rating'},
    {value: 'reviews', viewValue: 'Review'}
  ];

  selectedValue = this.sortOptions[0].value; // default sorting

  constructor(private _flowerService: FlowerService, private router: Router) { }

  inputName = async() => {
    await Swal.fire({
      title: 'Your name?',
      text: "We keep your name confidential!",
      input: 'text',
      confirmButtonColor: '#9c27b0',
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter your name!'
        }
        else {
          this._flowerService.setUserName(value);
          this.userName = this._flowerService.userName;
        }
      }
    });
  }

  searchQuery = (query) => {
    this.flowers = this.flowersConstant.filter((flower) =>  JSON.stringify(flower).toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  sortFlowers = (selectedValue) => {

    if (selectedValue === 'rating'){
      this.flowers = this.flowers.sort((a,b) => {
        return b.rating - a.rating
      });
    }

    else if (selectedValue === 'reviews'){
      this.flowers = this.flowers.sort((a,b) => {
        return b.reviews - a.reviews
      });
    }

    else if (selectedValue === 'name'){
       function compareName (a, b)  {
        // case-insensitive comparison
        a = a.toLowerCase();
        b = b.toLowerCase();
      
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      }
      this.flowers = this.flowers.sort((a,b) => {
        return compareName(a.name, b.name)
      });
    }
  }

  goToFlower= (flower) => {
    this.router.navigate(['/flowers', flower.id])
  }

  showError = (error) => {
    Swal.fire({
      icon: 'error',
      title: error.status,
      text: error.message,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }

  ngOnInit(): void {
    this._flowerService.getFlowersList().subscribe(
      (data) => {
        this.flowersConstant = this.flowers = data;
        this.sortFlowers(this.selectedValue);
        this.userName = this._flowerService.userName;
        if(!this._flowerService.userName) {
          this.inputName();
        }
      },
      (error) => {
        this.showError(error);
      }
    );
  }

}
