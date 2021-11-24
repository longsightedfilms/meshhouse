import { Vue, Component, Prop } from 'vue-property-decorator';

@Component<ModelComments>({
})
export default class ModelComments extends Vue {
  @Prop({ type: Array, required: true }) comments!: SFMLabModelComment[]
}
