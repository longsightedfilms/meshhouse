<template>
  <div class="about">
    <h1>This is an debug page</h1>
    <ul>
      <li><p>Current application data path: <b>{{ returnAppPath }}</b></p></li>
      <li><p>Current application exe path: <b>{{ returnExecutablePath }}</b></p></li>
      <li><p>Current user documents path: <b>{{ returnDocsPath }}</b></p></li>
      <li><p>Current user OS: <b>{{ returnUserOS }}</b></p></li>
    </ul>
    <div>
      <p>Testing buttons:</p>
      <v-btn
        color="primary"
        @click="runApp"
      >
        Run 3ds Max test scene
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import notifier from 'node-notifier'
import path from 'path'
import { spawn } from 'child_process'
import { remote, shell } from 'electron'

@Component({})
export default class About extends Vue {
  get returnAppPath(): string {
    return remote.app.getPath('userData')
  }

  get returnDocsPath(): string {
    return remote.app.getPath('documents')
  }

  get returnExecutablePath(): string {
    return remote.app.getAppPath()
  }

  get returnUserOS(): string {
    let os
    switch(remote.process.platform) {
      case "win32":
        os = 'Windows '
        break
      case "linux":
        os = 'Linux '
        break
      case "darwin":
        os = 'Mac OSX '
        break
    }
    return os + remote.process.getSystemVersion()
  }

  mounted(): void {
    const router = this.$router
    const notifierObject = {
      appName: "com.longsightedfilms.meshhouse",
      title: 'My notification',
      message: 'Hello, there!',
      icon: 'icon.png',
      wait: true
    }
    /*notifier.notify(notifierObject, (err: any, response: any) => {
      console.log('test')
    })*/
    notifier.on('click', function(notifierObject: any, options: any) {
      router.push('/')
      remote.getCurrentWindow().show();
    });
  }

  runApp(): void {
    const max = (this.$dccGetConfig() as any).adsk_3dsmax

    if(max.useSystemAssociation === true) {
      shell.openItem(path.join(this.returnDocsPath, path.normalize("\\3dsmax\\scenes\\Studio_scene_share.max")))
    } else {
      spawn(max.customPath, [ path.join(this.returnDocsPath, path.normalize("\\3dsmax\\scenes\\Studio_scene_share.max")) ])
    }
  }
}
</script>
