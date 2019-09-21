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
      <v-btn color="primary" @click="runApp">Run 3ds Max test scene</v-btn>
    </div>
  </div>
</template>

<script>
import notifier from 'node-notifier'
import path from 'path'
import { spawn } from 'child_process'
import { remote, shell } from 'electron'

export default {
  name: "About",
  computed: {
    returnAppPath() {
      return remote.app.getPath('userData')
    },
    returnDocsPath() {
      return remote.app.getPath('documents')
    },
    returnExecutablePath() {
      return remote.app.getAppPath()
    },
    returnUserOS() {
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
  },
  methods: {
    runApp() {
      let max = this.$dccGetConfig().adsk_3dsmax

      if(max.useSystemAssociation === true) {
        shell.openItem(path.join(this.returnDocsPath, path.normalize("\\3dsmax\\scenes\\Studio_scene_share.max")))
      } else {
        spawn(max.customPath, [ path.join(this.returnDocsPath, path.normalize("\\3dsmax\\scenes\\Studio_scene_share.max")) ])
      }
    }
  },
  mounted: function() {
    const router = this.$router
    const notifierObject = {
      appName: "com.longsightedfilms.meshhouse",
      title: 'My notification',
      message: 'Hello, there!',
      icon: path.join(__static, 'icon.png'),
      wait: true
    }
    notifier.notify(notifierObject, (err, response) => {})
    notifier.on('click', function(notifierObject, options) {
      console.log("Toast clicked!");
      router.push('/')
      remote.getCurrentWindow().show();
    });
  }
}
</script>
