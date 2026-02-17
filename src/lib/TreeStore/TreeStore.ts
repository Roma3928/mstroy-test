import type { itemId, TreeItem } from './types';

export class TreeStore<T extends TreeItem> {
  private items: T[];
  private itemMap = new Map<itemId, T>();
  private childrenMap = new Map<itemId | null, Set<itemId>>();

  constructor(items: T[]) {
    this.items = [...items];

    for (const item of this.items) {
      this.itemMap.set(item.id, item);

      if (!this.childrenMap.has(item.parent)) {
        this.childrenMap.set(item.parent, new Set());
      }

      this.childrenMap.get(item.parent)!.add(item.id);
    }
  }

  getAll(): T[] {
    return this.items;
  }

  getItem(id: itemId): T | undefined {
    return this.itemMap.get(id);
  }

  getChildren(id: itemId): T[] {
    const childrenIds = this.childrenMap.get(id);

    if (!childrenIds) return [];

    const result: T[] = [];
    for (const childId of childrenIds) {
      const child = this.itemMap.get(childId);
      if (child) result.push(child);
    }

    return result;
  }

  getAllChildren(id: itemId): T[] {
    const result: T[] = [];
    const childrenIds = [...(this.childrenMap.get(id) ?? [])];

    while (childrenIds.length) {
      const currentId = childrenIds.pop()!;
      const item = this.itemMap.get(currentId)!;
      result.push(item);

      const children = this.childrenMap.get(currentId);
      if (children) childrenIds.push(...children);
    }

    return result;
  }

  getAllParents(id: itemId): T[] {
    const result: T[] = [];
    let current = this.itemMap.get(id);

    while (current) {
      result.push(current);
      if (current.parent === null) break;
      current = this.itemMap.get(current.parent);
    }

    return result;
  }

  addItem(item: T) {
    this.items.push(item);
    this.itemMap.set(item.id, item);

    if (!this.childrenMap.has(item.parent)) {
      this.childrenMap.set(item.parent, new Set());
    }

    this.childrenMap.get(item.parent)!.add(item.id);
  }

  updateItem(updated: T) {
    const existing = this.itemMap.get(updated.id);
    if (!existing) return;

    if (existing.parent !== updated.parent) {
      this.childrenMap.get(existing.parent)?.delete(existing.id);

      if (!this.childrenMap.has(updated.parent)) {
        this.childrenMap.set(updated.parent, new Set());
      }

      this.childrenMap.get(updated.parent)!.add(updated.id);
    }

    Object.assign(existing, updated);
  }

  removeItem(id: itemId) {
    const toRemove = new Set([id]);

    const stack = [id];
    while (stack.length) {
      const currentId = stack.pop()!;
      const children = this.childrenMap.get(currentId);
      if (children) {
        for (const childId of children) {
          stack.push(childId);
          toRemove.add(childId);
        }
      }
    }

    for (const rid of toRemove) {
      const item = this.itemMap.get(rid);
      if (!item) continue;

      this.childrenMap.get(item.parent)?.delete(rid);
      this.childrenMap.delete(rid);
      this.itemMap.delete(rid);
    }

    if (toRemove.size > 0) {
      this.items = this.items.filter((i) => !toRemove.has(i.id));
    }
  }
}
