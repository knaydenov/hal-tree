import { PageableResource, Resource, IResource } from "@knaydenov/hal";
import { DataSource } from "@angular/cdk/table";
import { CollectionViewer } from "@angular/cdk/collections";
import { BehaviorSubject, Subscription, Subject } from "rxjs";

export interface IHalTreeDataSourceConfig<T extends Resource<any>> {
  reslovePageableResource: (item: T) => PageableResource<T>;
  resloveParentResource?: (item: T) => T;
  resolveTitle?: (item: T) => string;
  itemFromData?: (data: IResource) => T;
}

export class HalTreeDataSource<T extends Resource<IResource>> extends DataSource<T> {
    _items$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
    private _pageableResource: PageableResource<T>;
    private _currentPageableResource$: BehaviorSubject<PageableResource<T>>;
    private _currentItem$: BehaviorSubject<T|null> = new BehaviorSubject<T|null>(null);
    private _itemSubscription: Subscription|null = null;
    private _reslovePageableResource: (item: T) => PageableResource<T>;
    private _resloveParentResource: (item: T) => T;
    private _itemFromData: (data: IResource) => T;
    private _resolveTitle?: (item: T) => string;

    constructor(
      pageableResource: PageableResource<T>,
      config: IHalTreeDataSourceConfig<T>
    ) {
      super();
      this._pageableResource = pageableResource;
      this._currentPageableResource$ = new BehaviorSubject<PageableResource<T>>(this._pageableResource);
      
      this._reslovePageableResource = config.reslovePageableResource ?  config.reslovePageableResource : (item) => item['childern'];
      this._resloveParentResource = config.resloveParentResource ? config.resloveParentResource : (item: T) => item.hasLink('parent') ? item['parent'] : null;
      this._resolveTitle = config.resolveTitle ? config.resolveTitle : (item: T) => item['title'];
      this._itemFromData = config.itemFromData ? config.itemFromData : null;

      this.currentPageableResource$.subscribe(pageableResource => {
        if (this._itemSubscription) {
          this._itemSubscription.unsubscribe();
        }

        this._itemSubscription = pageableResource
          .items$
          .subscribe(items => {
            if (pageableResource.page === 1) {
              this.items$.next(items);
            } else {
              this.items$.next([...this.items, ...items]);
            }
          });

          if (pageableResource.hasData) {
            if (!pageableResource.isFirst) {
              pageableResource.navigateFirst();
            } else {
              pageableResource.refresh();
            }
          }
      });
    }

    get resolveParentResource() {
        return this._resloveParentResource;
    }

    get resolveTitle() {
      return this._resolveTitle;
    }

    get currentPageableResource$() {
      return this._currentPageableResource$;
    }

    get currentPageableResource() {
      return this.currentPageableResource$.value;
    }
  
    get currentItem$() {
      return this._currentItem$;
    }

    get currentItem() {
      return this._currentItem$.value;
    }

    set currentItem(item: T|null) {
      this.currentItem$.next(item);
      if (item) {
        this.currentPageableResource$.next(this._reslovePageableResource(item));
      } else {
        this.currentPageableResource$.next(this._pageableResource);
      }
    }

    get pageableResource() {
      return this._pageableResource;
    }
  
    get items$() {
      return this._items$;
    }
  
    get items() {
      return this._items$.value;
    }

    addItem(data: any, options?: any): Subject<IResource> {
      const addItem$ = this
        .currentPageableResource
        .addItem(data)
      ;

      if (this._itemFromData) {
        addItem$.
        toPromise()
        .then(itemData => {
          this.items$.next([...this.items, this._itemFromData(itemData)])
        })
      }

      return addItem$;
    }

    removeItem(item: T) {
      const indexOfItem = this.items.indexOf(item);
      const remainingItems = this.items.slice(0);

      if (indexOfItem !== -1) {
        remainingItems.splice(indexOfItem, 1);
      }

      const delete$ = item
        .delete()
      ;

      delete$
        .toPromise()
        .then(() => {
          this.items$.next(remainingItems);
        })

      return delete$;
    }

    get isLoading() {
      return this.currentPageableResource.isLoading;
    }

    refresh() {
      this.currentPageableResource.refresh();
    }

    get hasMore() {
      return this.currentPageableResource.hasNext;
    }

    more() {
      this.currentPageableResource.navigateNext();
    }

    connect(collectionViewer: CollectionViewer) {
      return this.items$;
    }

    disconnect() {

    }
  
    // connect(collectionViewer: CollectionViewer) {
    //   return this.items$;
    // }
  
    // disconnect() {
  
    // }

    // add(bookmark: Bookmark) {
    //   this.items$.next([...this.items, bookmark]);
    // }

    // remove(bookmark: Bookmark) {
    //   this.items$.next(this.items.filter(item => item !== bookmark));
    // }

    // get currentPageableResource() {
    //   return this._currentPageableResource$.value;
    // }
}
