import { PageableResource, Resource, IResource } from "@knaydenov/hal";
import { DataSource } from "@angular/cdk/table";
import { HalTreeItem } from "./hal-tree-item";
import { CollectionViewer } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, merge } from "rxjs";
import { map } from "rxjs/operators";

export class HalTreeDataSource<T extends Resource<IResource>> extends DataSource<HalTreeItem<T>> {
    private _items$: BehaviorSubject<HalTreeItem<T>[]> = new BehaviorSubject<HalTreeItem<T>[]>([]);
    private _autoload: boolean = false;

    private _pageableResource: PageableResource<T> | undefined;
    private _transformItem: (item: T) => HalTreeItem<T>;

    constructor(
        config: {
            pageableResource?: PageableResource<T>,
            transformItem?: (item: T) => HalTreeItem<T>,
            autoload?: boolean,
            parent?: HalTreeItem<T>
        }
    ) {
        super();
        this._pageableResource = config.pageableResource || null;
        this._transformItem = config.transformItem || ((item: T) => new HalTreeItem<T>(item, {}));
        this._autoload = config.autoload || false;

        if (this.pageableResource) {
            // Clear list 
            if (this.pageableResource.page !== 1) {
                this.pageableResource.items$.next([]);
                this.pageableResource.navigateFirst();
            }

            this
                .pageableResource
                .items$
                .subscribe(items => {
                    if (this.pageIndex === 0) {
                        this.items$.next(items.map(item => this.transformItem(item)));
                        if (this.autoload) {
                            this.more();
                        }
                    } else {
                        this.items$.next([...this.items, ...items.map(item => this.transformItem(item))]);
                        if (this.autoload) {
                            this.more();
                        }
                    }
                });
        }

        
    }

    get items$() {
        return this._items$;
    }

    get items() {
        return this.items$.value;
    }

    get pageableResource() {
        return this._pageableResource;
    }

    get isLoading(): boolean {
        return this.pageableResource ? this.pageableResource.isLoading : undefined;
    }

    get limit(): number {
        return this.pageableResource ? this.pageableResource.limit : undefined;
    }

    get total(): number {
        return this.pageableResource ? this.pageableResource.total : undefined;
    }

    get pageIndex(): number {
        return this.pageableResource ? this.pageableResource.page - 1 : undefined;
    }

    get autoload() {
        return this._autoload;
    }

    get hasMore() {
        return this.pageableResource ? this.pageableResource.hasNext : false;
    }

    connect(collectionViewer: CollectionViewer): Observable<HalTreeItem<T>[]> {
        return merge(collectionViewer.viewChange, this._items$).pipe(map(() => this.items));
    }

    disconnect(collectionViewer: CollectionViewer): void {

    }

    transformItem (item: T) {
        return this._transformItem(item);
    }

    appendItem(item: T) {
        this.items$.next([...this.items, this.transformItem(item)]);
    }

    removeItem(item: T) {
        this.items$.next(this.items.filter(_item => _item.item !== item));
    }

    more() {
        if (!this.pageableResource) {
            return;
        }

        if (this.pageableResource.hasNext) {
            this
                .pageableResource
                .navigateNext()
            ;
        }
    }

    refresh() {
        if (!this.pageableResource) {
            return;
        }

        this
            .pageableResource
            .navigateFirst()
        ;
    }
}
