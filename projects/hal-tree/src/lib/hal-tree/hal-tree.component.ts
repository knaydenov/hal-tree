import { Component, OnInit, Input, ContentChildren, QueryList, ContentChild, ViewChild, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { HalTreeDataSource } from '../hal-tree-data-source';
import { NestedTreeControl } from '@angular/cdk/tree';
import { HalTreeItem } from '../hal-tree-item';
import { SelectionModel } from '@angular/cdk/collections';
import { HalTreeActionDefDirective } from '../hal-tree-action-def.directive';
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'hal-tree',
  templateUrl: './hal-tree.component.html',
  styleUrls: ['./hal-tree.component.scss']
})
export class HalTreeComponent implements OnInit {
  treeControl: NestedTreeControl<HalTreeItem<any>>;

  @Input() selection: SelectionModel<HalTreeItem<any>>;
  @Input() dataSource: HalTreeDataSource<any>;
  @Input() showSelection: boolean = false;

  @ContentChildren(HalTreeActionDefDirective) _actionDefs: QueryList<HalTreeActionDefDirective>;

  constructor() {
    this.treeControl =  new NestedTreeControl<HalTreeItem<any>>(this.getChildren);
  }

  getChildren(node: HalTreeItem<any>): BehaviorSubject<HalTreeItem<any>[]> {
    return node.children$;
  }

  isSelected(node: HalTreeItem<any>): boolean {
    return this.selection.isSelected(node);
  }

  toggleSelection(node: HalTreeItem<any>): void {
    this.selection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);

    if (!this.selection.isSelected(node)) {
      this.selection.deselect(...descendants)
    }
  }

  isLoading(node: HalTreeItem<any>) {
    return node.isLoading;
  }

  showLoadMore(dataSource: HalTreeDataSource<any>) {
    return dataSource && !dataSource.isLoading && !dataSource.autoload && dataSource.hasMore;
  }

  loadMore(dataSource: HalTreeDataSource<any>) {
    dataSource.more();
  }

  ngOnInit() {
  }
}
