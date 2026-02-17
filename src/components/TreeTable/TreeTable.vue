<script setup lang="ts">
import 'ag-grid-enterprise';
import { AgGridVue } from 'ag-grid-vue3';

import { TreeStore } from '../../lib/TreeStore/TreeStore';
import type { TreeItem } from '../../lib/TreeStore/types';
import { mapTreeToRows } from '../../lib/TreeStore/utils';

import { autoGroupColumnDef, columnDefs, defaultColDef } from './tableConfig';

const props = defineProps<{ items: TreeItem[] }>();

const store = new TreeStore(props.items);

const rows = mapTreeToRows(store);
</script>

<template>
  <AgGridVue
    class="treeTable"
    :rowData="rows"
    :columnDefs="columnDefs"
    :autoGroupColumnDef="autoGroupColumnDef"
    :treeData="true"
    :getDataPath="(data) => data.path"
    :default-col-def="defaultColDef"
    :groupDefaultExpanded="1"
    :animateRows="true"
    :suppressContextMenu="true"
    :suppressMovableColumns="true"
  />
</template>

<style>
.treeTable {
  height: 98vh;
  width: 100%;
}

.treeTable
  .ag-cell.ag-cell-last-left-pinned:not(
    .ag-cell-range-right,
    .ag-cell-range-single-cell,
    .ag-cell-focus:not(.ag-cell-range-selected):focus-within
  ) {
  border-right: none;
  font-weight: bold;
}

.treeTable .ag-row {
  border-bottom-width: 2px;
}

.treeTable .ag-header-cell:not(.ag-column-last) {
  border-right: 1px solid #d9dadb;
}
</style>
