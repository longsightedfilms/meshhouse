import { Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ name: 'notifications' })
export default class NotificationsStore extends VuexModule {
  notifications: ApplicationNotification[] = []

  @Mutation
  addNotification(payload: ApplicationNotification): void {
    this.notifications.push(payload);
  }

  @Mutation
  removeNotification(index: number): void {
    this.notifications.splice(index, 1);
  }
}
