import React, { Component} from 'react';
import axios from "axios";
import { GoogleMap, LoadScript, Polygon} from '@react-google-maps/api';
import { slide as Menu } from "react-burger-menu";
import "./../sidebar/Sidebar.css";
import { useRef } from "react";
import "./../text/text.css";
import { useHistory } from "react-router";


function Text(props) {
  var lot_name = props.data1.toString().replace(/\n/g, '');
  const phone_number = useRef();
  const history = useHistory();
  const send_form = async (e) =>  
  {
      //console.log(lot_name);
      e.preventDefault();
      const new_driver = {
          parking_lot: lot_name,
          phone_number: phone_number.current.value
        }
      console.log(new_driver);
        try {
          axios.post("/text/text_notifications", new_driver);
          alert("You have successfully subscribed!");
          history.push("/");
        } catch (err) {
          console.log(err);
        }
  };
  return (
      <>
      <main id="site-main-map">
          <div className="container">
              <div className="form-title text-center">
                  <h2 className="text-dark">{lot_name} Text Notification Subscription</h2>
                  <span className="text-light">
                      Use the below form to subscribe and receive text notifications!
                  </span>
              </div>
              <form onSubmit = {send_form} id="add_number">
                  <div className="new_number">
                      <div className="form-group">
                          <label htmlFor="phonenumber" className="text-light">Phone Number</label>
                          <input type="tel" ref={phone_number} name="phonenumber" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" defaultValue="" required placeholder="Phone Number"></input>
                          <small>Format: 1234567890</small>
                      </div>
                      <div className="form-group">
                          <button type="submit" className="btn text-white update">Subscribe</button>
                      </div>
                  </div>
              </form>
          </div>
      </main>
      </>
  );
}

const containerStyle = {
  width: '95%',
  height: '800px'
};


class GMap extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      parking_spots: [],
      lot_bounds: [],
      lot_center: [],
      lot_name: this.props.data.toString().replace(/\n/g, ''),
      mapoptions: {
        tilt: 0,
        mapTypeId: "satellite",
        streetViewControl: false,
        mapTypeControl: false,
        restriction: 
        {
          latLngBounds: [],
          strictBounds: true,
        }
      }
    }
    this.get_parking_spots = this.get_parking_spots.bind(this);
    this.get_parking_lot_info = this.get_parking_lot_info.bind(this);
  } 

  async get_parking_spots() {
    axios.get(`/map/spots/${encodeURIComponent(this.state.lot_name)}`)
    .then(res => {
      try {
        let tmpArray = []
        //Push the polygon coordinates into an array
        for (var i = 0; i < res.data.length; i++) {
           tmpArray.push(res.data[i])
        }
        this.setState(
          {parking_spots: tmpArray
          });
      } catch (err) {
        console.log(err);
      }
    })
  }

  async get_parking_lot_info() {
  axios.get("/map/parking_lot/Kensington Progress Update Demo")
  .then(res => {
    try {
      this.setState(prevstate =>
        ({
          ...prevstate,
          mapoptions: {
            ...prevstate.mapoptions,
            restriction: {
                ...prevstate.mapoptions.restriction, 
                   latLngBounds : res.data[0].bounds
                }
            },
            lot_center : res.data[0].center
        }
        ))
    }
     catch (err) {
      console.log(err);
    }
})
}

componentDidMount()
{
  this.get_parking_lot_info();
  //Initial call to retrieve data from DB
  this.get_parking_spots();
  //Timer to refresh component every thirty seconds and update spots
  this.interval = setInterval(() => {this.get_parking_spots()}, 30000);
}

componentWillUnmount() 
{
  clearInterval(this.interval);
}

renderpolygons = () => {
  //Wait for the parking spots array to have coordinates in them
  if(this.state.parking_spots.length !== 0)
  {
    return this.state.parking_spots.map((location, i) => {
      return <Polygon
      options={{fillColor: this.state.parking_spots[i].occupied ? "red" : "green", fillOpacity: 1}}
      paths = {this.state.parking_spots[i].polygons}
      key = {i}/>
    })
  }
}

  render() {
    if(this.state.mapoptions.restriction.latLngBounds === null)
    {
      <div>Loading...</div>
    }
    return (
      <>
      <LoadScript
        googleMapsApiKey=""
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={this.state.lot_center}
          zoom={1}
          options={this.state.mapoptions}
        >
          <div>
            {this.renderpolygons()}
          </div>
        </GoogleMap>
      </LoadScript>
      </>
    )
  }
}

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curParkingLot : JSON.parse(localStorage.getItem('curParkingLot')) || "Kensington",
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
    }, () => localStorage.setItem('curParkingLot', JSON.stringify(this.state.curParkingLot)))
  }

  componentDidMount()
  {
      this.get_parking_lots();
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
            //curParkingLot : resParkingLots[0],
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
        return <a onClick={(e) => this.changeParkingLot(e)} className="menu-item" href="/" key = {i}>
          {this.state.parkingLotList[i]} <br />
        </a>
      })
    }
  }
  
  render(){
    return (
      <>
      <Menu pageWrapId={"page-wrap"}>
      <div>
        {this.genMenuList()}
      </div>
      </Menu>
      <GMap data={this.state.curParkingLot}/>
      <Text data1={this.state.curParkingLot}/>
      </>
    )
  }
  
}
export default Sidebar;