import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faFontAwesome, faVuejs } from '@fortawesome/free-brands-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import axios from 'axios'
import VueAxios from 'vue-axios'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
const path = require('path');

library.add(faGithub)
library.add(faFontAwesome)
library.add(faVuejs)
library.add(faHeart)

createApp(App)
    .component("fa-icon", FontAwesomeIcon)
    .use(router)
    .use(VueAxios, axios)
    .mount("#app");

module.exports = { 
    webpackFinal: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, '../src/'),
        };

        return config;
    }
}