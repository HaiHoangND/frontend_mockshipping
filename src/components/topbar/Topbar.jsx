import { Person } from "@mui/icons-material";
import "./topbar.scss";
import { useAuthUser } from "react-auth-kit";

export const Topbar = () => {
  const authUser = useAuthUser();
  const username = authUser().username;
  const profilePicture = authUser().profilePicture
  return (
    <div className="topbarContainer">
      <div></div>
      <div className="profilePicture">
        <div className="profilePictureWrapper">
          {profilePicture ? 
            <img src={profilePicture}/>
          :<Person />}
        </div>
        {username}
      </div>
    </div>
  );
};
