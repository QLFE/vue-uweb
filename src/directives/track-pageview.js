import uweb from '../index'
import { notChanged, isEmpty } from './util'

export let watch = []

const trackPageview = {
  bind (el, binding) {
    let index = watch.findIndex(element => element === el)
    let isWatched = index !== -1
    // watch for a v-show binded element, push it to watch queue when v-show is false
    if (el.style.display === 'none') {
      if (!isWatched) watch.push(el)
      return
    } else {
      // remove from watch queue when v-show is true
      if (isWatched) watch.splice(index, 1)
    }
    if (!isWatched && (notChanged(binding) || isEmpty(binding))) return

    let args = []

    // passing parameters as object
    if (typeof binding.value === 'object') {
      let value = binding.value
      if (value.content_url) args.push(value.content_url)
      if (value.referer_url) args.push(value.referer_url)

      // passing parameters as string separate by comma
    } else if (typeof binding.value === 'string' && binding.value) {
      args = binding.value.split(',')
      args.forEach((arg, i) => (args[i] = arg.trim()))
    }

    uweb.trackPageview(...args)
  },
  unbind (el, binding) {
    let index = watch.findIndex(element => element === el)
    if (index !== -1) watch.splice(index, 1)
  }
}
trackPageview.update = trackPageview.bind

export default trackPageview
