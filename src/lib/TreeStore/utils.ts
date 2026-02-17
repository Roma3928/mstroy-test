import type { TreeItem } from './types';
import type { TreeStore } from './TreeStore';

interface TreeRow extends TreeItem {
  order: number;
  category: 'Группа' | 'Элемент';
  path: string[];
}

export function mapTreeToRows<T extends TreeItem>(store: TreeStore<T>): TreeRow[] {
  const result: TreeRow[] = [];
  let order = 1;

  const roots = store.getChildren(null as any);

  const walk = (item: T, parentPath: string[]) => {
    const path = [...parentPath, item.label];
    const children = store.getChildren(item.id);
    const hasChildren = children.length > 0;

    result.push({
      ...item,
      order: order++,
      category: hasChildren ? 'Группа' : 'Элемент',
      path,
    });

    for (const child of children) {
      walk(child, path);
    }
  };

  for (const root of roots) {
    walk(root, []);
  }

  return result;
}
