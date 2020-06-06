import { Filter } from './../shared/interfaces';
import { OrdersService } from './../shared/services/orders.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import {
  MaterialInstance,
  MaterialService,
} from '../shared/classes/material.service';
import { Subscription } from 'rxjs';
import { Order } from '../shared/interfaces';

const STEP = 10;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  isFilterVisible = false;
  oSub: Subscription;
  tooltip: MaterialInstance;
  orders: Order[] = [];
  filter: Filter = {};

  offset = 0;
  limit = STEP;

  loading = false;
  reloading = false;
  noMoreOrders = false;

  @ViewChild('tooltip') tooltipRef: ElementRef;
  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.reloading = true;
    this.fetch();
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit,
    });
    this.oSub = this.ordersService.fetch(params).subscribe((orders) => {
      this.orders = this.orders.concat(orders);
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.fetch();
  }

  ngOnDestroy() {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch();
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }
}
