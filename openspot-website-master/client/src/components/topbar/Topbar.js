import React, { Component } from 'react'
import {MenuItems} from "./MenuItems"
import './Topbar.css';
import {Button} from "../Button"

class Topbar extends Component {
    state = { clicked: false }

    handleClick = () => {
        this.setState({
            clicked: !this.state.clicked
        })
    }
    render() {
        return(
            <nav className="TopbarItems">
                <h1 className="topbar-logo">
                    OpenSpot
                </h1>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}>
                    </i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map((item, index) =>{
                        return (
                        <li key={index}>
                            <a className={item.cName} href={item.url}>
                                {item.title}
                            </a>
                        </li>
                        )    
                    })}
                </ul>
            <div className="signupbtn">
                <Button>
                    Sign Up
                </Button>
            </div>
            </nav>

        )
    }
}

export default Topbar;