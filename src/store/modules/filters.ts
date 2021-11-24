export default {
  state: {
    order: 'ASC',
    search: '',
    category: -1,
    extension: '',
    path: ''
  },
  mutations: {
    setFilterOrder(state: FiltersState, payload: 'ASC' | 'DESC'): void {
      state.order = payload;
    },
    setFilter(state: FiltersState, payload: FilterPayload): void {
      state[payload.field] = payload.value;
    },
    setFilters(state: FiltersState, payload: FiltersState): Promise<boolean> {
      state.filters = payload;
      return Promise.resolve(true);
    },
  },
};
