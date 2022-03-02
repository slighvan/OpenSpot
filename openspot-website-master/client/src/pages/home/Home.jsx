import Topbar from "../../components/topbar/Topbar";
import Rightbar from "../../components/rightbar/Rightbar";

import "./home.css"


export default function Home() {

  return (
    <>
      <Topbar/>
       <div className="homeContainer">
       <Rightbar/>
      </div> 
    </>
  );
}
