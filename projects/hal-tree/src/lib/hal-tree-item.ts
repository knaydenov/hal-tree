import { Resource, IResource } from "@knaydenov/hal";
import { HalTreeDataSource } from "./hal-tree-data-source";
import { BehaviorSubject } from "rxjs";

export class HalTreeItem<T extends Resource<IResource>> {
    private _resolveDataSource: (item: T) => HalTreeDataSource<any>
    private _childrenDataSource: HalTreeDataSource<any> = null;

    constructor(
        private _item: T,
        config: {
            resolveDataSource?: (item: T) => HalTreeDataSource<any>,
            parent?:  HalTreeItem<any>
        }
    ) {
       this._resolveDataSource = config.resolveDataSource || ((item: T) => new HalTreeDataSource({}));
    }

    get title() {
        return String(this._item);
    }

    get childrenDataSource() {
        return this._childrenDataSource 
            ? this._childrenDataSource 
            : this._childrenDataSource = this._resolveDataSource(this._item);
    }

    get children$(): BehaviorSubject<HalTreeItem<any>[]> {
        return this.childrenDataSource.items$;
    }

    get hasChildren() {
        return this.childrenDataSource.total > 0;
    }

    get item() {
        return this._item;
    }

    get isLoading() {
        return this.item.isLoading || this.childrenDataSource.isLoading;
    }
}
