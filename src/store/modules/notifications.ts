export default {
  state: [],
  mutations: {
    addNotification(state: ApplicationNotification[], payload: ApplicationNotification): void {
      state.push(payload);
    },
    removeNotification(state: ApplicationNotification[], index: number): void {
      state.splice(index, 1);
    },
  }
};
