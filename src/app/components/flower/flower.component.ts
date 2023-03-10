import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FlowerService } from '../../services/flower.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavService } from '../../services/side-nav.service';

@Component({
  selector: 'app-flower',
  templateUrl: './flower.component.html',
  styleUrls: ['./flower.component.scss']
})
export class FlowerComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenav', {static: true}) public sidenav: MatSidenav;

  public flowers = [];
  public flower;
  public cartItems = [];
  public totalAmount = 0;
  public isFetched: boolean = false;
  public toggleMode = "over";
  public userName = '';
  public isSideNavShowing: boolean = false;

  constructor(private _flowerService: FlowerService, private route: ActivatedRoute, 
    private router: Router, private _sidenavService: SideNavService) { }

  scrollTop = () => {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
  }

  getFlower = (id: number) => {
    try {
      return this.flowers.filter((flower) => flower.id == id);
    }
    catch(e) {
      console.log(e);
    }
  }

  addToMyCart = (menu) => {
    const newItem = {
      "id": menu.id,
      "name": menu.name,
      "price": menu.price,
      "quantity": 1
    }

    if(this.isItemAlreadyExist(newItem)) {
      this.itemAlreadyExistModal(newItem);
    }
    else {
      this.addItemToMyCart(newItem);
      this.itemAddedModal(newItem);
      this.calculateAmount();
    }
  }

  addItemToMyCart = (newItem) => {
    this._flowerService.setCartItem(newItem);
    this.cartItems = this._flowerService.cartItems;
  }

  isItemAlreadyExist = (newItem) => {
    return this._flowerService.cartItems.find((cartItem) => cartItem.id == newItem.id);
  }

  itemAddedModal = (newItem) => {
    Swal.fire({
      icon: 'success',
      title: `${newItem.name} added to your basket!`,
      text: "Click on 'View My Basket' button below to view your basket or click on the basket icon at the top of the page",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#9c27b0',
      confirmButtonText: 'View My Basket',
      cancelButtonText: 'Close',
      cancelButtonColor: '#e23c3c'
    }).then((result) => {
      if (result.isConfirmed) {
        this.toggleSideNav();
      }
    });
  }

  toggleSideNav = () => {
    this.scrollTop();
    this._sidenavService.toggle();
  }

  itemAlreadyExistModal = (newItem) => {
    Swal.fire({
      icon: 'warning',
      title: `${newItem.name} is already exist in your basket!`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#9c27b0',
      confirmButtonText: 'View My Basket',
      cancelButtonText: 'Close',
      cancelButtonColor: '#e23c3c'
    }).then((result) => {
      if (result.isConfirmed) {
        this.toggleSideNav();
      }
    });
  }

  removeItem = (cartItem) => {
    this._flowerService.removeCartItem(cartItem);
    this.cartItems = this._flowerService.cartItems;
    this.calculateAmount();
  }

  addQuantity = (cartItem) => {
    this.cartItems.forEach((item,index)=>{
      if(item.id == cartItem.id)
        this.cartItems[index].quantity = Number(this.cartItems[index].quantity)  + 1; 
   });
   this.calculateAmount();
  }

  removeQuantity = (cartItem) => {
    this.cartItems.forEach((item,index)=>{
      if(item.id == cartItem.id) {
        if (this.cartItems[index].quantity > 0)
          this.cartItems[index].quantity -= 1;
      }
   });
   this.calculateAmount();
  }

  calculateAmount = () => {
    this.totalAmount = 0; 
    this.cartItems.map((item) => {
      this.totalAmount = this.totalAmount + (item.quantity*item.price)
    });
  }

  openPaymentMethod = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "It's just a sample confirmation message!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9c27b0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, pay bill!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Payment Successfull!',
          text: "It's just a sample success message. We can integrate real time UPI service!",
          showConfirmButton: true,
          confirmButtonColor: '#9c27b0'
        });
      }
    })
  }

  ngAfterViewInit(): void {
    this._sidenavService.setSidenav(this.sidenav);
  }

  ngOnInit(): void {
    this.scrollTop();
    this._flowerService.getFlowersList().subscribe((data) => {
      this.flowers = data;
      this.route.paramMap.subscribe((params: ParamMap) => {
        [this.flower] =  this.getFlower(parseInt(params.get('id')));
      })
    });

    this.userName = this._flowerService.userName;
    this.cartItems = this._flowerService.cartItems;
    this.calculateAmount();

    if(!this.userName) {
      this.router.navigateByUrl("/flowers");
    }
  }
}
