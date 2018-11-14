import React from 'react'
import { PropTypes } from 'prop-types'

const NoStateSon = (props, context) => {
  console.log(props)
  console.log(context)
  return (
    <div>儿子---无状态组件
    {props.propA}
      {props.propB}
      {context.topA}
    </div>
  )
}

NoStateSon.contextTypes = {
  topA: PropTypes.string,
  topMethodA: PropTypes.func
}

export default NoStateSon
