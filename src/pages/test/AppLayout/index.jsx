import React, { Component } from 'react'
import SlotProviderHoc from '../SlotProviderHoc'
import Slot from '../Slot'

@SlotProviderHoc
class AppLayout extends Component {
  static displayName = 'AppLayout'
  render() {
    return (
      <div className="app-lay-out">
        <header>
          <Slot name="header" />
        </header>
        <main>
          <Slot />
        </main>
        <footer>
          <Slot name="footer" />
        </footer>
      </div>
    )
  }
}

export default AppLayout
