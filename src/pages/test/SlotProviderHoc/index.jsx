import React, { Component } from 'react'
import { PropTypes } from 'prop-types'

function getDisplayName(component) {
  return component.displayName || component.name || 'component'
}

export default function SlotProviderHoc(Comp) {
  return class extends Component {
    static displayName = `SlotProvider(${getDisplayName(Comp)})`

    static childContextTypes = {
      requestAddOnRenderer: PropTypes.func
    }

    constructor(props) {
      super(props)
      // 用于缓存每个<AddOn />的内容
      this.addOnRenderers = {}
    }

    getChildContext() {
      const requestAddOnRenderer = (name) => {
        if (!this.addOnRenderers[name]) {
          return undefined
        }
        return () => {
          this.addOnRenderers[name]
        }
      }
      return {
        requestAddOnRenderer
      }
    }

    render() {
      const { children, ...restProps } = this.props
      if (children) {
        // 以k-v的形式，缓存<AddOn />的内容
        const arr = React.Children.toArray(children)
        const nameChecked = []
        this.addOnRenderers = {}
        arr.forEach(item => {
          const itemType = item.type
          if (itemType.displayName === 'AddOn') {
            const slotName = item.props.slot || '$$default'
            // 确保内容的唯一性
            if (nameChecked.findIndex(item => item === slotName) !== -1) {
              throw new Error(`名称为${slotName}的插槽已经存在了`)
            }
            this.addOnRenderers[slotName] = item.props.children
            nameChecked.push(slotName)
          }
        })
        return (
          <Comp {...restProps} />
        )
      }
    }
  }
}
