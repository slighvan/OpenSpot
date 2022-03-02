import React, { Component } from 'react';
import { slide as Menu } from "react-burger-menu";
import axios from "axios";
import "./Sidebar.css";

class Sidebar extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      curParkingLot : "Kensington",
      menuOpen: false,
      parkingLotList : [],
      menuItems: []
    }
    this.changeParkingLot = this.changeParkingLot.bind(this)
    this.get_parking_lots = this.get_parking_lots.bind(this)
  } 

  //Stores selected parking lot
  changeParkingLot(e) {
    var parkingLotName = e.target.innerText;
    this.setState({
      curParkingLot : parkingLotName,
      menuOpen : false
    }, () => console.log(this.state.curParkingLot))
  }

  componentDidMount()
  {
      this.get_parking_lots();
      console.log(this.state.curParkingLot);
  }

  async get_parking_lots() {
    axios.get("/map/parking_lots")
    .then(res => {
      try {
        let resParkingLots = []
        //Push the polygon coordinates into an array
        for (var i = 0; i < res.data.length; i++) {
          resParkingLots.push(res.data[i].parkingLotName)
        }
        this.setState(
          {
            curParkingLot : resParkingLots[0],
            parkingLotList : resParkingLots
          });
      } catch (err) {
        console.log(err);
      }
    })
  }
  genMenuList = () => {
    if(this.state.parkingLotList.length !== 0)
    {
      return this.state.parkingLotList.map((m, i) => {
        return <a onClick={(e) => this.changeParkingLot(e)} className="menu-item" href="/">
          {this.state.parkingLotList[i]} <br />
        </a>
      })
    }
  }
  
  render(){
    return (
      <Menu>
      <div>
        {this.genMenuList()}
      </div>
      </Menu>
    )
  }
  
}
export default Sidebar;
