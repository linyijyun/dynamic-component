import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appDragDropSwap]'
})
export class DragDropSwapDirective {

  @Input() uniqueKey: string;

  constructor() { }


  ngOnInit() {
    console.log(this.uniqueKey);
  }

  ngOnChanges() {
    console.log(this.uniqueKey);
  }

}
