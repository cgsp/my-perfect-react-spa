import React, { Children } from 'react'
import './style'

export default function ManageColumnsTitle({ title, children }) {
    return (
        <h6 className="manage-column-title">
            {title}
            {Children.map(children, text => text && <div className="action-btn">{text}</div>)}
        </h6>
    )
}
