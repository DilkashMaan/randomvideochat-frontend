// import React, { useRef, useState } from "react";
// import "./style/AccountModal.css";

// const AccountModal = ({ onClose }) => {
//   const [editMode, setEditMode] = useState(false);
//   const fileInputRef = useRef(null);

//   const profile = {
//     username: "JohnDoe",
//     email: "john@example.com",
//     dob: "1990-01-01",
//     gender: "Male",
//     image: "../home-images/account.png",
//   };

//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dateString).toLocaleDateString("en-US", options);
//   };

//   return (
//     <div className="modal-overlay" onClick={onClose} id="admin-account">
//       <div className="profile-page" onClick={(e) => e.stopPropagation()}>
//         <div className="profile-card">
//           <div className="profile-close-btn">
//             <button className="close-btn2" onClick={onClose}>
//               ×
//             </button>
//           </div>

//           <div className="profile-image-container">
//             <div className="image-wrapper">
//               <img
//                 src={profile.image}
//                 alt="Profile"
//                 className="profile-image"
//                 onClick={() => editMode && fileInputRef.current.click()}
//               />
//               {editMode && (
//                 <button
//                   className="change-image-btn"
//                   onClick={() => fileInputRef.current.click()}
//                 >
//                   +
//                 </button>
//               )}
//             </div>

//             {editMode && (
//               <button className="delete-image-btn">
//                 <img
//                   height={30}
//                   width={30}
//                   src="../home-images/delete.png 
//               "
//                 ></img>
//               </button>
//             )}

//             <input
//               type="file"
//               ref={fileInputRef}
//               accept="image/*"
//               style={{ display: "none" }}
//             />
//           </div>

//           {editMode ? (
//             <input
//               type="text"
//               className="edit-input"
//               name="username"
//               defaultValue={profile.username}
//             />
//           ) : (
//             <p className="profile-email">{profile.username}</p>
//           )}

//           {editMode ? (
//             <input
//               type="email"
//               className="edit-input2"
//               name="email"
//               defaultValue={profile.email}
//               disabled
//             />
//           ) : (
//             <p className="profile-email">{profile.email}</p>
//           )}

//           <div className="button-group">
//             {!editMode ? (
//               <button className="edit-btn" onClick={() => setEditMode(true)}>
//                 Edit Profile
//               </button>
//             ) : (
//               <>
//                 <button className="save-btn">Save Changes</button>
//                 <button
//                   className="edit-btn cancel-btn"
//                   onClick={() => setEditMode(false)}
//                 >
//                   Cancel
//                 </button>
//               </>
//             )}
//           </div>

//           <div className="profile-details">
//             <div className="detail-item">
//               <div className="detail-label">Date of Birth</div>
//               <div className="detail-value">{formatDate(profile.dob)}</div>
//             </div>

//             <div className="detail-item">
//               <div className="detail-label">Gender</div>
//               <div className="detail-value">{profile.gender}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountModal;




import React, { useRef, useState } from "react";
import "./style/AccountModal.css";

const AccountModal = ({ onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef(null);

  const profile = {
    username: "JohnDoe",
    email: "john@example.com",
    dob: "1990-01-01",
    gender: "Male",
    image: "../home-images/account.png",
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="admin-account">
      <div className="profile-page" onClick={(e) => e.stopPropagation()}>

          

        <div className="profile-card">

        
          <div className="profile-close-btn">
              <div>
              <h5>User Profile</h5>
            </div>
            
            <button className="close-btn2" onClick={onClose}>
              ×
            </button>
          </div>
          

     <div className="image-info">
           <div className="profile-image-container">
            <div className="image-wrapper">
              <img
                src={profile.image}
                alt="Profile"
                className="profile-image"
                onClick={() => editMode && fileInputRef.current.click()}
              />
              {editMode && (
                <button
                  className="change-image-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  +
                </button>
              )}
            </div>

            {editMode && (
              <button className="delete-image-btn">
                <img
                  height={30}
                  width={30}
                  src="../home-images/delete.png 
              "
                ></img>
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

        <div className="info-div">

          <div className="detail-item">
            <div className="detail-label">Name</div>
              {editMode ? (
            <input
              type="text"
              className="edit-input detail-value"
              name="username"
              defaultValue={profile.username}
            />
          ) : (
            <p className="profile-email">{profile.username}</p>
          )}
          </div>

         <div className="detail-item">
          <div className="detail-label">Email</div>
           {editMode ? (
            <input
              type="email"
              className="edit-input2 detail-value"
              name="email"
              defaultValue={profile.email}
              disabled
            />
          ) : (
            <p className="profile-email">{profile.email}</p>
          )}
         </div>

          <div className="profile-details">
            <div className="detail-item">
              <div className="detail-label">Date of Birth</div>
              <div className="detail-value">{formatDate(profile.dob)}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Gender</div>
              <div className="detail-value">{profile.gender}</div>
            </div>
          </div>


          <div className="button-group">
            {!editMode ? (
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            ) : (
              <>
                <button className="save-btn">Save Changes</button>
                <button
                  className="edit-btn cancel-btn"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
     </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
