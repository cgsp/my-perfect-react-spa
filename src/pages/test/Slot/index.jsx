import { PropTypes } from 'prop-types'

// 前一个参数是 props，后面一个参数是 Context
const Slot = ({ name, children }, { requestAddOnRenderer }) => {
  const addOnRenderers = requestAddOnRenderer(name)
  return (
    (addOnRenderers && addOnRenderers()) || children || null
  )
}

Slot.displayName = 'Slot'
Slot.contextTypes = {
  requestAddOnRenderer: PropTypes.func
}
Slot.propTypes = {
  name: PropTypes.string
}
Slot.defaultProps = {
  name: '$$default'
}

export default Slot
