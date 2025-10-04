import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Loader from '../components/Loader.vue'

describe('Loader Component', () => {
  it('should render spinner', () => {
    const wrapper = mount(Loader)
    expect(wrapper.find('.spinner').exists()).toBe(true)
  })

  it('should render message when provided', () => {
    const message = 'Loading tasks...'
    const wrapper = mount(Loader, {
      props: { message }
    })
    
    expect(wrapper.text()).toContain(message)
  })

  it('should not render message when not provided', () => {
    const wrapper = mount(Loader)
    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('should have correct CSS classes', () => {
    const wrapper = mount(Loader)
    expect(wrapper.find('.loader').exists()).toBe(true)
    expect(wrapper.find('.spinner').exists()).toBe(true)
  })
})