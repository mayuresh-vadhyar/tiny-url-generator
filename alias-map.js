'use strict';
const { Logger } = require('./logger');
const path = ['alias-map'];

class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(aliasEntry) {
        this.heap.push(aliasEntry);
        this.bubbleUp(this.heap.length - 1);
    }

    bubbleUp(index) {
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex].expireAt <= this.heap[index].expireAt) {
                break;
            }

            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    extractMin() {
        if (this.heap.length === 0) return null;

        const min = this.heap[0];
        const end = this.heap.pop();

        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.bubbleDown(0);
        }

        return min;
    }

    bubbleDown(index) {
        const length = this.heap.length;
        while (true) {
            let leftChildIdx = 2 * index + 1;
            let rightChildIdx = 2 * index + 2;
            let swap = null;

            if (leftChildIdx < length) {
                if (this.heap[leftChildIdx].expireAt < this.heap[index].expireAt) {
                    swap = leftChildIdx;
                }
            }

            if (rightChildIdx < length) {
                if ((swap === null && this.heap[rightChildIdx].expireAt < this.heap[index].expireAt) ||
                    (swap !== null && this.heap[rightChildIdx].expireAt < this.heap[leftChildIdx].expireAt)) {
                    swap = rightChildIdx;
                }
            }

            if (swap === null) break;

            [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
            index = swap;
        }
    }

    peek() {
        return this.heap.length === 0 ? null : this.heap[0];
    }
}


class AliasMap {

    constructor() {
        Logger.log(path, 'Creating alias map');
        this.active = new Map();
        this.expiryHeap = new MinHeap();
    }

    getAlias(key) {
        const alias = this.active.get(key);
        if (!alias || alias && alias.isExpired()) {
            throw new Error('Alias does not exist or has expired');
        }
        return alias;
    }

    addAlias(alias) {
        if (alias.constructor.name !== 'Alias') {
            throw new Error('Incompatible type for alias');
        }
        this.active.set(alias.custom_alias, alias);
        setTimeout(() => alias.expire(), alias.ttl_seconds * 1000);
        return alias.custom_alias;
    }

    expireAlias(customAlias) {
        Logger.log(path, 'Deleting Alias - ', customAlias)
        this.active.delete(customAlias);
        return true;
    }

}

class AliasMapSingleton {
    aliasMap = null;

    static getAliasMap() {
        if (!this.aliasMap) {
            this.aliasMap = new AliasMap();
        }
        return this.aliasMap;
    }
}

module.exports = { AliasMap: AliasMapSingleton };