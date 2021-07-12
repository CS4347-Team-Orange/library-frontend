import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faFontAwesome, faVuejs } from '@fortawesome/free-brands-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faGithub)
library.add(faFontAwesome)
library.add(faVuejs)
library.add(faHeart)

createApp(App)
    .component("fa-icon", FontAwesomeIcon)
    .use(router)
    .mount("#app");