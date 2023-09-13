import { Person } from "@mui/icons-material";
import "./topbar.scss";
import { useAuthUser } from "react-auth-kit";
import { useLocation } from "react-router-dom";

export const Topbar = () => {
  const authUser = useAuthUser();
  const username = authUser().username;
  const profilePicture = authUser().profilePicture;
  const pathname = useLocation().pathname.split("/");
  return (
    <div className="topbarContainer">
      <div style={{ fontSize: "17px", paddingLeft: "10px" }}>
        {pathname[1] === "orderDetail" ? `Mã vận đơn: ${pathname[2]}` : ""}
      </div>
      <div className="profilePicture">
        <div className="profilePictureWrapper">
          {profilePicture ? <img src={profilePicture} /> : <Person />}
        </div>
        {username}
      </div>
    </div>
  );
};
