import type { ColDef } from 'ag-grid-enterprise';

export const defaultColDef: ColDef = {
  resizable: false,
  sortable: false,
  filter: false,
  suppressHeaderMenuButton: true,
};

export const columnDefs: ColDef[] = [
  { headerName: '№ п/п', field: 'order', width: 100, pinned: 'left' },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 1,
  },
];

export const autoGroupColumnDef: ColDef = {
  headerName: 'Категория',
  field: 'category',
  flex: 0.5,
  cellRendererParams: {
    suppressCount: true,
  },
};
