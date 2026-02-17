import { describe, it, expect, beforeEach } from 'vitest';
import { TreeStore } from '../../lib/TreeStore/TreeStore';
import type { TreeItem } from '../../lib/TreeStore/types';

const items: TreeItem[] = [
  { id: 1, parent: null, label: 'Root 1' },
  { id: 2, parent: 1, label: 'Child 1' },
  { id: 3, parent: 1, label: 'Child 2' },
  { id: 4, parent: 2, label: 'Grandchild 1' },
];

let store: TreeStore<TreeItem>;

describe('TreeStore', () => {
  beforeEach(() => {
    store = new TreeStore(items);
  });

  it('should get all items', () => {
    expect(store.getAll()).toHaveLength(4);
  });

  it('should get item by id', () => {
    expect(store.getItem(2)?.label).toBe('Child 1');
    expect(store.getItem(999)).toBeUndefined();
  });

  it('should get direct children', () => {
    const children = store.getChildren(1);
    expect(children.map((c) => c.id)).toEqual([2, 3]);
  });

  it('should get all descendants', () => {
    const allChildren = store.getAllChildren(1);
    expect(allChildren.map((c) => c.id).sort()).toEqual([2, 3, 4]);
  });

  it('should get all parents', () => {
    const parents = store.getAllParents(4);
    expect(parents.map((p) => p.id)).toEqual([4, 2, 1]);
  });

  it('should add an item', () => {
    const newItem: TreeItem = { id: 5, parent: 3, label: 'Child of 3' };
    store.addItem(newItem);

    expect(store.getItem(5)?.label).toBe('Child of 3');
    expect(store.getChildren(3).map((c) => c.id)).toContain(5);
  });

  it('should update an item', () => {
    store.updateItem({ id: 2, parent: 3, label: 'Moved Child 1' });

    expect(store.getItem(2)?.parent).toBe(3);
    expect(store.getChildren(1).map((c) => c.id)).not.toContain(2);
    expect(store.getChildren(3).map((c) => c.id)).toContain(2);
  });

  it('should remove an item with descendants', () => {
    store.removeItem(2);
    expect(store.getItem(2)).toBeUndefined();
    expect(store.getItem(4)).toBeUndefined();
    expect(store.getChildren(1).map((c) => c.id)).toEqual([3]);
  });
});
