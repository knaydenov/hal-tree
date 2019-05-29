import { Component, OnInit, Input, ContentChildren, QueryList, ContentChild, ViewChild, AfterViewChecked, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { HalTreeDataSource } from '../hal-tree-data-source';
import { SelectionModel } from '@angular/cdk/collections';
import { HalTreeActionDefDirective } from '../hal-tree-action-def.directive';
import { FormControl } from '@angular/forms';
import { Resource } from '@knaydenov/hal';
import { debounceTime } from 'rxjs/operators';

export enum SelectionMode {
  NONE = 0,
  SINGLE = 1,
  MULTIPLE = 2
}

@Component({
  selector: 'hal-tree',
  templateUrl: './hal-tree.component.html',
  styleUrls: ['./hal-tree.component.scss']
})
export class HalTreeComponent<T extends Resource<any>> implements OnInit {
  queryControl: FormControl;
  
  @Input() dataSource: HalTreeDataSource<T> = null; 
  @Input() selection: SelectionModel<T> = null; 
  @Input() actions: string[] = []; 
  @Input() selectionMode: SelectionMode = SelectionMode.NONE;
  @Input() moreActionsLabel: string = 'Show more actions';
  @Input() searchLabel: string = 'Search';
  @Input() loadMoreLabel: string = 'Load more';
  @Input() addLabel: string = 'Add';
  @Input() noItemsLabel: string = 'No items';

  @ContentChildren(HalTreeActionDefDirective) _actionDefs: QueryList<HalTreeActionDefDirective>;

  constructor() {
    this.queryControl =  new FormControl(this.query);
  }

  ngOnInit() {
        this
      .queryControl
      .valueChanges
      .pipe(debounceTime(1000))
      .subscribe(query => this.query = query);
  }

  get showSpinner() {
    return this.dataSource.isLoading;
  }

  get showNoItems() {
    return !this.dataSource.isLoading && !this.items.length;
  }

  get showClear() {
    return !!this.query;
  }

  clearQuery() {
    this.queryControl.setValue('');
  }

  get query() {
    const q = this.dataSource.pageableResource.filters.find(f => f.field === 'q');
    return q ? q.value : null;
  }

  set query(query: string) {
    if (query) {
      this.dataSource.pageableResource.filters = [
        {
          field: 'q', 
          value: query, 
          multiple: false
        }, 
        {
          field: 'root',
          value: 'n',
          multiple: false
        }, 
        {
          field: 'page',
          value: '1',
          multiple: false
        }
      ]
    } else {
      this.dataSource.pageableResource.filters = []
    }
    this
      .dataSource
      .pageableResource
      .commit()
      .subscribe(() => this.dataSource.currentItem = null)
    ;
  }

  get showLoadMore() {
    return !this.dataSource.isLoading && this.dataSource.hasMore;
  }

  loadMore() {
    this.dataSource.more();
  }

  isItemSelected(item: T): boolean {
    return this.selection.isSelected(item);
  }

  toggleSelection(node: T): void {
    if (this.selectionMode === SelectionMode.SINGLE) {
      this.selection.clear();
    }
    
    this.selection.toggle(node);
  }

  get isSelectionEmpty() {
    return this.selection.isEmpty();
  }

  get items$() {
    return this.dataSource.items$;
  }

  get items() {
    return this.items$.value;
  }

  // get currentItem$() {
  //   return this._currentItem$;
  // }

  get currentItem() {
    return this.dataSource.currentItem;
  }

  openItem(bookmark: T|null) {
    this.dataSource.currentItem = bookmark;
  }

  addItem() {
    // const dialogRef: MatDialogRef<BookmarkDialogComponent, IBookmarkDialogData> = this.dialog.open<BookmarkDialogComponent, IBookmarkDialogData>(BookmarkDialogComponent, {
    //   data: {}
    // });
    // dialogRef.afterClosed().subscribe(data => {
    //   if (data) {
    //     this
    //       .dataSource
    //       .addItem({title: data.title})
    //     ;
    //   }
    // });
  }

  openPrevious() {
    this.openItem(this.dataSource.resolveParentResource(this.dataSource.currentItem));
  }

  get selectedItems() {
    return this.selection.selected;
  }

  deselectItem(item: T) {
    this.selection.deselect(item);
  }

  get itemActions() {
    return this
      .actions
      .map(actionName => this._actionDefs.find(action =>  action.name === actionName))
      .filter(action => action !== undefined);
  }
}
