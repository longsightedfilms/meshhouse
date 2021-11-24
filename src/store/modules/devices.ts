import { Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ name: 'devices' })
export default class DevicesStore extends VuexModule {
  currentDevice: Device = {
    model: '',
    os: '',
    hostname: '',
    uuid: ''
  }
  devices: Device[] = [
    {
      model: 'Apple iPhone XS',
      os: 'iOS 13.9',
      hostname: '',
      uuid: ''
    }
  ]

  @Mutation
  setCurrentDevice(payload: Device): void {
    this.currentDevice = payload;
  }
}
