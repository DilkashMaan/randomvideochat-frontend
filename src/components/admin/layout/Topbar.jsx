import { useState } from "react";
import Account from "../Account"; 

 const Topbar = ({ toggleSidebar }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="topbar">
        <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
        <div className="profile" onClick={() => setShowModal(true)}>
          <img src="../home-images/account.png" alt="Account" />John deoo
        </div>
      </div>

      {showModal && <Account onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Topbar;