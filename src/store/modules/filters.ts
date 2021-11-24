import { Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ name: 'filters' })
export default class FiltersStore extends VuexModule {
  order = 'ASC'
  search = ''
  category = -1
  extension = ''
  path = ''

  @Mutation
  setFilterOrder(payload: 'ASC' | 'DESC'): void {
    this.order = payload;
  }

  @Mutation
  setFilter(payload: FilterPayload): void {
    (this as FiltersState)[payload.field] = payload.value;
  }
}
