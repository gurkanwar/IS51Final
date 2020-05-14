import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';


export interface IBike {
  id?: number;
  image?: string;
  description?: string;
  price?: number;
  quantity?: number;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  bikes: Array<IBike> = [];
  nameFixed: string;
  params: string;

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.bikes = await this.loadBikes();
  }
  async loadBikesFromJson() {
    const bikes = await this.http.get('assets/inventory.json').toPromise();
    return bikes.json();
  }

  async loadBikes() {
    let bikes = JSON.parse(localStorage.getItem('bikes'));
    if (bikes && bikes.length > 0) {
    } else {
      bikes = await this.loadBikesFromJson();
    }
    console.log('this.bikes from ngOninit...', this.bikes);
    this.bikes = bikes;
    return bikes;
  }

  addBike1() {
    const bike: IBike = {
      id: null,
      image: '../../assets/bike1.jpeg',
      description: null,
      price: null,
      quantity: 1

    };
    this.bikes.unshift(bike);
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }
  addBike2() {
    const bike: IBike = {
      id: null,
      image: '../../assets/bike2.jpeg',
      description: null,
      price: null,
      quantity: 1

    };
    this.bikes.unshift(bike);
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }

  addBike3() {
    const bike: IBike = {
      id: null,
      image: '../../assets/bike3.jpeg',
      description: null,
      price: null,
      quantity: 1

    };
    this.bikes.unshift(bike);
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }

  deleteBike(index: number) {
    this.bikes.splice(index, 1);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }

  checkout() {

    let tax = 0;
    let subtotal = 0;



    if (this.params === null) {
      this.toastService.showToast('warning', 5000, 'Name must not be null');
      return null;
    } else if (this.params.search(', ') === -1) {
      this.toastService.showToast('warning', 5000, 'Name must have a comma and space before first name');
      return null;
    } else {

      const total = this.bikes.reduce((acc: number, item: IBike) => {
        acc += item.quantity * item.price;

        return acc;
      }, 0);
      tax = total * .15;
      subtotal = total - tax;
    }

    return {
      name: this.nameFixed,
      tax: tax,
      subtotal: subtotal,
      total: subtotal + tax
    };
  }


  calculate(params: string) {
    if (params == null) {
      this.toastService.showToast('warning', 7000, 'Name must not be null');
    } else {
      const commaIndex = this.params.indexOf(', ');
      const firstName = this.params.slice(commaIndex + 2, this.params.length);
      const lastName = this.params.slice(0, commaIndex);
      this.nameFixed = firstName + ' ' + lastName;
      const data = this.checkout();
      this.router.navigate(['invoice', data]);

    }

  }
}


