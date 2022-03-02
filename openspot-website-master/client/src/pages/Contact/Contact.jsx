import axios from "axios";
import { useRef } from "react";
import "./Contact.css"
import { useHistory } from "react-router";
import Topbar from "../../components/topbar/Topbar"

export default function TextNotifications() {

const name = useRef();
const email = useRef();
const phone_number = useRef();
const message = useRef();
const history = useHistory();

const send_form = async (e) =>  
{
    e.preventDefault();
    const new_contact = {
        name: name.current.value,
        email: email.current.value,
        phone_number: phone_number.current.value,
        message: message.current.value
      }
      try 
      {
        console.log(new_contact);
        axios.post("/contact/contact", new_contact);
        alert("Thanks, a representative from OpenSpot will contact you soon!");
        history.push("/Contact");
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
                <h2 className="text-dark">Contact Us</h2>
                <span className="text-light">
                    Use the form below to learn more about OpenSpot!
                </span>
            </div>
            <form onSubmit = {send_form} id="add_number">
                <div className="new_number">
                    <div className="form-group">
                        <label htmlFor="name" className="text-light">Name</label>
                        <input type="text" ref={name} name="name" defaultValue="" required placeholder="Name"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phonenumber" className="text-light">Phone Number</label>
                        <input type="tel" ref={phone_number} name="phonenumber" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" defaultValue="" required placeholder="Phone Number"></input>
                        <small>Format: 1234567890</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="text-light">Email</label>
                        <input type="email" ref={email} name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" defaultValue="" required placeholder="Email"></input>
                        <small>Format: example@gmail.com</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message" className="text-light">Message</label>
                        <textarea type = "message" rows="4" cols="50" ref={message} name="message" defaultValue="" required placeholder="Enter your message here"></textarea>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn text-white update">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    </main>
    </>
  );
}
