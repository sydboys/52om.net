import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import edit from '@/components/edit/edit'
import album from '@/components/album/album'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: index
    }, {
      path: '/edit',
      name: 'edit',
      component: edit
    }, {
      path: '/album',
      name: 'album',
      component: album
    }
  ]
})
