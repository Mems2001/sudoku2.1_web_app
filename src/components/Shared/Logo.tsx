import React from "react"

type Size = "small" | "regular" | "large"

interface LogoProps {
    size?: Size 
}

const Logo:React.FC<LogoProps> = ({size = "regular"}) => {
    function handleContainerSize(size:Size) {
        switch (size) {
            case "small": 
                return "logo size-small"
            case "regular":
                return "logo size-regular"
            case "large": 
                return "logo size-large"
        }
    }

    function handleSeparatorWidth(size:Size, orientation: "v" | "h") {
        switch (size) {
            case "small":
                return `separator-${orientation} separator-small`
            case "regular":
                return `separator-${orientation} separator-regular`
            case "large":
                return `separator-${orientation} separator-large`

        }
    }

    return (
        <div className={handleContainerSize(size)}>
            <span className="logo-1"></span>
            <span className="logo-2"></span>
            <span className="logo-3"></span>
            <span className="logo-4"></span>
            <hr className={handleSeparatorWidth(size, "v")}></hr>
            <hr className={handleSeparatorWidth(size, "h")}></hr>
        </div>
    )
}

export default Logo