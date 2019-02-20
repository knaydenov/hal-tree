import { Directive } from '@angular/core';
import { HalTreeItem } from './hal-tree-item';

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
  icon: string = '';
  handler: (node: HalTreeItem<any>) => void;
  show: (node: HalTreeItem<any>) => boolean = (node: HalTreeItem<any>) => true;
  enable: (node: HalTreeItem<any>) => boolean = (node: HalTreeItem<any>) => true;

  handle(node: HalTreeItem<any>) {
    const handler = this.handler.bind(this.this);
    handler(node);
  }

  shouldShow(node: HalTreeItem<any>): boolean {
    const show = this.show.bind(this.this);
    return show(node);
  }

  shouldEnable(node: HalTreeItem<any>): boolean {
    const enable = this.enable.bind(this.this);
    return !node.isLoading && enable(node);
  }
}
