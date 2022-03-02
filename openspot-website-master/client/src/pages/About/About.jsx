import "./About.css"
import Topbar from "../../components/topbar/Topbar"

export default function About() {

  return (
    <>
    <Topbar />
    <main id="site-main">
        <div className="container">
            <div className="form-title text-center">
                <h2 className="text-dark">About Us</h2>
            </div>
                <div className="new_number">
                    <div className="form-group">
                        <div type="text">
                        As populations and accessibility to driving have increased, finding parking has become difficult in busy areas such as universities, malls, and stadiums. This is what inspired the team at OpenSpot to develop a smart parking system to help migrate old parking conventions into the new technology era. The smart parking system consists of a computer vision algorithm that detects occupancy status of parking stalls and is used in combination with our website that provides drivers with real-time spot specific status. The system is packaged in a discrete hardware module that mounts on existing light poles which ensures complete coverage and easy installation for a low entry to barrier solution. The LED indicator light informs drivers at the parking lot, about the current density of parked cars around the module. This gives drivers an understanding of how easy or difficult it may be to find a vacant spot and guide them to take calculated risks in terms of time spent seeking a parking stall. With the ongoing threat of car-thefts, OpenSpot has also decided to tackle this problem by providing security features such as car alarm detection, security notification, and flashing emergency blue-lights to indicate the location of distress. A more pleasant parking and visiting experience is achieved when congestion, danger, and reliance on luck is out of the equation. 
                        </div>
                    </div>
                </div>
        </div>
    </main>
    </>
  );
}
