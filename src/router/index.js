import Vue from 'vue'
import Router from 'vue-router'
import CardsAgainstHumanity from '@/components/CardsAgainstHumanity'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CardsAgainstHumanity',
      component: CardsAgainstHumanity,
    },
  ],
})
