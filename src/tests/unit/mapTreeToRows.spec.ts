import { describe, it, expect } from 'vitest';
import { TreeStore } from '../../lib//TreeStore/TreeStore';
import { mapTreeToRows } from '../../lib/TreeStore/utils';

describe('mapTreeToRows', () => {
  it('корректно мапит дерево в строки', () => {
    const store = new TreeStore([
      { id: 1, parent: null, label: 'A' },
      { id: 2, parent: 1, label: 'B' },
    ]);

    const rows = mapTreeToRows(store);

    expect(rows).toHaveLength(2);
    expect(rows[0]?.category).toBe('Группа');
    expect(rows[1]?.category).toBe('Элемент');
    expect(rows[1]?.path).toEqual(['A', 'B']);
  });
});
