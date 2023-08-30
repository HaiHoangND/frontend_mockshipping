import { Person } from "@mui/icons-material";
import "./topbar.scss";

export const Topbar = () => {
  return (
    <div className="topbarContainer">
      <div></div>
      <div className="profilePicture">
        <div className="profilePictureWrapper">
          <Person />
        </div>
        Long Trần
      </div>
    </div>
  );
};
