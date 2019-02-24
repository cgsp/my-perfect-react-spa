import React from 'react'
import { PropTypes } from 'prop-types'

const Child = (props, context) => {
  const {
    propA, methodA
  } = context

  return [
    <div key="propA">{propA}</div>,
    <div key="methodA">{methodA}</div>
  ]
}

Child.contextTypes = {
  propA: PropTypes.string,
  methodA: PropTypes.func,
}

export default Child
