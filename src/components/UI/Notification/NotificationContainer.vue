<template>
  <transition-group
    class="v-notifications"
    name="v-notifications"
    tag="div"
  >
    <div
      v-for="(obj, idx) in notifications"
      :key="`v-notification-${idx}`"
      :class="buttonClass(obj)"
    >
      <vue-icon
        class="icon--inverted"
        :icon="notificationIcon(obj.type).icon"
        :raster="notificationIcon(obj.type).raster"
        static
      />
      <p>{{ obj.message }}</p>
      <v-button
        type="glass"
        size="sm"
        icon-only
        @click="removeNotification(idx)"
      >
        <vue-icon
          class="icon--inverted"
          icon="delete"
          static
        />
      </v-button>
    </div>
  </transition-group>
</template>

<style lang="sass">
@import 'Notification'
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import NotificationsStore from '@/store/modules/notifications';

@Component<NotificationContainer>({})
export default class NotificationContainer extends Vue {
  get notifications(): ApplicationNotification[] {
    return getModule(NotificationsStore, this.$store).notifications;
  }

  buttonClass(notification: ApplicationNotification): string {
    let fullClass = 'v-notification';

    const type = notification.type.trim();

    if(type !== '') {
      fullClass += ` v-notification--${type}`;
    }

    return fullClass;
  }

  notificationIcon(type: string): object {
    switch (type) {
    case 'primary':
      return {
        icon: 'info',
        raster: false
      };
    case 'error':
      return {
        icon: 'error',
        raster: true
      };
    default:
      return {
        icon: 'info',
        raster: false
      };
    }
  }

  removeNotification(idx: number): void {
    this.$store.commit('removeNotification', idx);
  }

  addNotification(): void {
    this.$store.commit('addNotification', {
      type: 'primary',
      message: 'Added notification'
    });
  }
}
</script>
