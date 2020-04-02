import React from 'react'

export default (props) => {
    return (
        <div>
            {props.levelDots.map((dot, i) => {
                const style = {
                    left: `${dot[0]}%`,
                    top: `${dot[1]}%`,
                }
                return (
                    <div className="level-dot" key={i} style={style}></div>
                )
            })}
        </div>
    )
}