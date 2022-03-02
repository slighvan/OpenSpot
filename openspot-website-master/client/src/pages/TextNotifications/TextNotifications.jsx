import axios from "axios";
import { useRef } from "react";
import "./TextNotifications.css"
import { useHistory } from "react-router";
import Topbar from "../../components/topbar/Topbar"

export default function TextNotifications() {

const parking_lot = useRef();
const phone_number = useRef();
const history = useHistory();
const rem_parking_lot = useRef();
const rem_phone_number = useRef();

const send_form = async (e) =>  
{
    e.preventDefault();
    const new_driver = {
        parking_lot: parking_lot.current.value,
        phone_number: phone_number.current.value
      }
      try 
      {
        axios.post("/text/text_notifications", new_driver);
        alert("You have successfully subscribed!");
        history.push("/TextNotifications");
      } catch (err) {
        console.log(err);
      }
};

const remove_driver = async (e) =>  
{
    e.preventDefault();
    const driver = 
    {
        parking_lot: rem_parking_lot.current.value,
        phone_number: rem_phone_number.current.value
    }
      try {
        console.log(driver);
        axios.post("/text/unsubscribe", driver);
        alert("You have successfully unsubscribed");
        history.push("/TextNotifications");
      } catch (err) {
        console.log(err);
      }
};

  return (
    <>
    <Topbar />
    <main id="site-main">
        <div className="container">
            <div className="form-title text-center">
                <h2 className="text-dark">Text Notification Subscription</h2>
                <span className="text-light">
                    Use the below form to subscribe and receive text notifications!
                </span>
            </div>
            <form onSubmit = {send_form} id="add_number">
                <div className="new_number">
                    <div className="form-group">
                        <label htmlFor="name" className="text-light">Parking Lot Name</label>
                        <input type="text" ref={parking_lot} name="name" defaultValue="" required placeholder="Parking Lot Name"></input>
                    </div>
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
        <div className="container">
            <div className="form-title text-center">
                <h2 className="text-dark">Text Notification Unsubscription</h2>
                <span className="text-light">
                    Use the below form to unsubscribe
                </span>
            </div>
            <form onSubmit = {remove_driver} id="add_number">
                <div className="new_number">
                    <div className="form-group">
                        <label htmlFor="name" className="text-light">Parking Lot Name</label>
                        <input type="text" ref={rem_parking_lot} name="name" defaultValue="" required placeholder="Parking Lot Name"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phonenumber" className="text-light">Phone Number</label>
                        <input type="tel" ref={rem_phone_number} name="phonenumber" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" defaultValue="" required placeholder="Phone Number"></input>
                        <small>Format: 1234567890</small>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn text-white update">Unsubscribe</button>
                    </div>
                </div>
            </form>
        </div>
    </main>
    </>
  );
}
