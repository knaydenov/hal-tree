import { Directive } from '@angular/core';
import { Resource } from '@knaydenov/hal';

@Directive({
  selector: '[halTreeActionDef]',
  inputs: [
    'name: halTreeActionDefName',
    'icon: halTreeActionDefIcon',
    'label: halTreeActionDefLabel',
    'handler: halTreeActionDefHandler',
    'show: halTreeActionDefShow',
    'enable: halTreeActionDefEnable',
    'this: halTreeActionDefThis',
  ],
})
export class HalTreeActionDefDirective {

  constructor() { }
  
  this: any;
  name: string;
  label: string;
  icon: string = '';
  handler: (item: Resource<any>) => void;
  show: (item: Resource<any>) => boolean = (item: Resource<any>) => true;
  enable: (item: Resource<any>) => boolean = (item: Resource<any>) => true;

  handle(item: Resource<any>) {
    const handler = this.handler.bind(this.this);
    handler(item);
  }

  shouldShow(item: Resource<any>): boolean {
    const show = this.show.bind(this.this);
    return show(item);
  }

  shouldEnable(item: Resource<any>): boolean {
    const enable = this.enable.bind(this.this);
    return !item.isLoading && enable(item);
  }
}
