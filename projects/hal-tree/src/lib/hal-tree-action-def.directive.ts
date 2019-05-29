import { Directive } from '@angular/core';
import { Resource } from '@knaydenov/hal';

@Directive({
  selector: '[halTreeActionDef]',
  inputs: [
    'icon: halTreeActionDefIcon',
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
  icon: string = '';
  handler: (node: Resource<any>) => void;
  show: (node: Resource<any>) => boolean = (node: Resource<any>) => true;
  enable: (node: Resource<any>) => boolean = (node: Resource<any>) => true;

  handle(node: Resource<any>) {
    const handler = this.handler.bind(this.this);
    handler(node);
  }

  shouldShow(node: Resource<any>): boolean {
    const show = this.show.bind(this.this);
    return show(node);
  }

  shouldEnable(node: Resource<any>): boolean {
    const enable = this.enable.bind(this.this);
    return !node.isLoading && enable(node);
  }
}
