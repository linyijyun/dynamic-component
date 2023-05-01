import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.scss']
})
export class ComponentSelectorComponent implements OnInit, OnChanges {
  @Output() choosed: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private utilsService: UtilsService,
  ) { }

  page1Components = this.utilsService.Page1Components;
  page2Components = this.utilsService.Page2Components;

  chooseComponent(name) {
    this.choosed.emit(name);
  }
  ngOnInit(): void {
  }

  ngOnChanges(changes: any): void {
    console.log(changes);
  }
}
