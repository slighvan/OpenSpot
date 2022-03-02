import "./rightbar.css";
import Map from "../map/Map";

export default function Rightbar() {
    return (
      <>
          <HomeRightbar />
      </>
    );
  }

  const HomeRightbar = () => {
    return (
      <>
      <div className="rightbar">
        <div className="rightbarWrapper">
          <Map />
        </div>
      </div>
      </>
    );
  };
