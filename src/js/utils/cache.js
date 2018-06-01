export default class Cache {

    constructor(ttlMs, now = () => Date.now()) {
        this._now = now;
        this._ttlMs = ttlMs || 1000;
        this._cache = {};
    }

    add = (key, data) => {
        console.log(`Adding to cache (${key}, ${data})`);
        this._cache[key] = {
            loaded: this._now(),
            data: data
        };
    };

    tryGetByKey = (key) => {
        const cache = this._cache;
        const entry = cache[key];

        if (entry && entry.loaded && (this._now() - entry.loaded) < this._ttlMs)
        {
            console.log(`Cache HIT (${key}, ${entry.data})@${entry.loaded}`);
            return entry.data;
        }
        console.log(`Cache MISS (${key})`);
        return null;
    };
}
