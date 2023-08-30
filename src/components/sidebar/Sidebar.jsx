import { Add, Group, Home } from "@mui/icons-material";
import "./sidebar.scss";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const pathname = useLocation().pathname.split("/");
  console.log(pathname);

  return (
    <div className="sidebarContainer">
      <div className="sapoLogoWrapper">
        <img
          src="https://sapo.dktcdn.net/fe-cdn-production/images/logo_sapo_white.svg"
          alt=""
        />
      </div>
      <hr />
      <div className="sidebarItemsWrapper">
        <Link to="/coordinator">
          <div
            className={
              pathname[1] === "coordinator" && !pathname[2]
                ? "sidebarItem selected"
                : "sidebarItem"
            }
          >
            <Home /> Trang chủ
          </div>
        </Link>
        <Link to={"/coordinator/createOrder"}>
          <div
            className={
              pathname[2] === "createOrder"
                ? "sidebarItem selected"
                : "sidebarItem"
            }
          >
            <Add /> Tạo đơn hàng
          </div>
        </Link>
        <div
          className={
            pathname[2] === "employees" ? "sidebarItem selected" : "sidebarItem"
          }
        >
          <Group /> Danh sách nhân viên
        </div>
      </div>
    </div>
  );
};
