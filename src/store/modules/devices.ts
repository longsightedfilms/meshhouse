export default {
  state: {
    currentDevice: {
      model: '',
      os: '',
      hostname: '',
      uuid: ''
    },
    devices: [
      {
        model: 'Apple iPhone XS',
        os: 'iOS 13.9',
        hostname: '',
        uuid: ''
      }
    ]
  },
  mutations:{
    setCurrentDevice(state: DevicesState, payload: Device): void {
      state.currentDevice = payload;
    }
  }
};
