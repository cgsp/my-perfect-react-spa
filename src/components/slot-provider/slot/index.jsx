import { PropTypes } from 'prop-types'

// 前一个参数是 props，后面一个参数是 Context
const Slot = ({ name, children }, { addOnRenderers }) => {
  const content = addOnRenderers[name]
  return (
    content || children || null
  )
}

Slot.displayName = 'Slot'
Slot.contextTypes = {
  addOnRenderers: PropTypes.object
}
Slot.propTypes = {
  name: PropTypes.string
}
Slot.defaultProps = {
  name: '$$default'
}

export default Slot
