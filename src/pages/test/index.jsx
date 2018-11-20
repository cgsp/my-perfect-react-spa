import React, { Component } from 'react'
import TestContainer from './test'
import style from './style'
import { Button } from 'antd'

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: 100
    }
  }

  render() {
    const { data } = this.state
    return (
      <div className="div2" id="gFather">
        <div className="div1" id="father">
          <TestContainer
            data={data}
            className="div1"
          />
        </div>
        <div className={style.box}> 因使用了WebKit的CSS扩展属性，该方法适用于WebKit浏览器及移动端；</div>
        <div style={{ margin: 10 }}>
          <Button type="primary">antdbtn</Button>
        </div>
        <div className={style.test}>
          1111
        <div className={style.name}>name</div>
        </div>
      </div >
    )
  }
}
