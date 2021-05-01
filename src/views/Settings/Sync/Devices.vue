<template>
  <div class="tab tab--devices">
    <h1>Ваши устройства</h1>
    <h2>Текущее устройство</h2>
    <div class="device device--current">
      <vue-icon
        icon="flaticon/computer"
      />
      <div>
        <b>{{ $store.state.devices.currentDevice.model }} ({{ $store.state.devices.currentDevice.hostname }})</b>
        <p>Система: {{ $store.state.devices.currentDevice.os }}</p>
        <p>ID устройства: {{ $store.state.devices.currentDevice.uuid }}</p>
      </div>
    </div>
    <h2>Устройства, связанные с аккаунтом</h2>
    <div
      v-for="(obj, key) in $store.state.devices.devices"
      :key="key"
      class="device"
    >
      <vue-icon
        icon="flaticon/smartphone"
      />
      <div>
        <b>{{ $store.state.devices.currentDevice.model }} ({{ $store.state.devices.currentDevice.hostname }})</b>
        <p>Система: {{ $store.state.devices.currentDevice.os }}</p>
        <p>ID устройства: {{ $store.state.devices.currentDevice.uuid }}</p>
      </div>
    </div>
  </div>
</template>
<script src="./Devices.ts" lang="ts"></script>
