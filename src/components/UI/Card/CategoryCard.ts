import { Vue, Component, Prop } from 'vue-property-decorator';
import VueContext from 'vue-context';
import ModelImage from '@/components/UI/Image/ModelImage.vue';
import AddCategoryModal from '@/views/Modals/AddCategoryModal.vue';

@Component({
  components: {
    ModelImage,
    VueContext
  }
})
export default class CategoryCard extends Vue {
  @Prop({
    type: Object,
    required: false,
    default(): object {
      return {
        id: 0,
        parentId: -1,
        slug: '',
        name: ''
      };
    }
  }) item!: Category;
  @Prop({
    type: String,
    required: false,
    default: 'simple'
  }) type!: string;

  get categoryName(): string {
    if (this.type === 'parent') {
      return this.$i18n.t('views.catalog.categories.parent').toString();
    } else if (this.type === 'new') {
      return this.$i18n.t('views.catalog.categories.new').toString();
    } else {
      return this.item.name;
    }
  }

  onDoubleClick(): void | Promise<void> {
    if (this.type === 'parent') {
      return this.getParentLevelLink();
    } else if (this.type === 'simple') {
      return this.getRouterLink();
    } else {
      return this.showModal();
    }
  }

  async getParentLevelLink(): Promise<void> {
    const query = `SELECT * FROM 'categories'
    WHERE id = ${this.$route.params.category}`;

    const categories = await this.$ipcInvoke<Category[]>('get-integration-categories', {
      type: 'local',
      title: this.$route.params.database,
      query
    });

    const parentId = categories[0].parentId;

    this.$store.commit('setFilter', {
      field: 'category',
      value: parentId
    });
    this.$router.push({
      path: `/db/local/${this.$route.params.database}${parentId !== -1 ? `/${parentId}` : ''}`
    });
  }

  getRouterLink(): void {
    const { id } = this.item;
    this.$store.commit('setFilter', {
      field: 'category',
      value: id !== undefined ? id : ''
    });
    this.$router.push({
      path: `/db/local/${this.$route.params.database}${id !== undefined ? `/${id}` : ''}`
    });
  }

  onRightClick(event: MouseEvent): void {
    if (this.type === 'simple') {
      (this.$parent.$parent.$refs.categoryMenu as any).open(event);
      if (this.$parent.$parent.$refs.menu !== undefined) {
        (this.$parent.$parent.$refs.menu as any).close(event);
      }
      this.$store.commit('setProperties', this.item);
    }
  }

  showModal(): void {
    this.$modal.show(AddCategoryModal, {}, {
      clickToClose: true,
      height: 'auto'
    });
  }

}
