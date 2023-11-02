
type item = {
	_id:string;
	[key:string]:any;
};

class IdBasedLRUCache<T extends item> {
	_items:Map<string,T>; // lru list - strong references
	_cache:Map<string,WeakRef<T>>; // weak references
	_finalizationRegistry:FinalizationRegistry<string>; // not sure what "item" actually should be
	_max:number;
	_cleanCount:number;
	_cleaningScheduled:boolean;

	constructor(maxSize:number=1000,cleanCount:number=20) {
		this._items = new Map();
		this._cache = new Map();
		this._finalizationRegistry = new FinalizationRegistry(this._reclaim);
		this._max = maxSize;
		this._cleanCount = cleanCount;
	}

	retrieve = (_id:string) => {
		const value = this._cache.get(_id)?.deref();
		if(value === undefined) return;
		this._items.delete(_id);
		this._items.set(_id,value);
		return value;
	};

	cache = (item:T) => {
		if(this._items.size >= this._max && !this._cleaningScheduled) {
			this._cleaningScheduled = true;
			this._clean(); // async
		}
		this._items.set(item._id,item);
		this._cache.set(item._id,new WeakRef(item));
		this._finalizationRegistry.register(item,item._id);
	}

	clear = () => {
		this._items.clear();
		this._cache.clear();
	};

	_clean = async() => {
		const iterator = this._items.keys()
		for(let i=this._cleanCount ; i>0 ; i--) {
			const key = iterator.next().value;
			this._items.delete(key);
		}
		this._cleaningScheduled = false;
	}

	_reclaim = (_id:string) => {
		this._cache.delete(_id);
	};
}



export default IdBasedLRUCache;
