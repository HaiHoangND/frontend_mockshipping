import { Add, Group, Home, Logout } from "@mui/icons-material";
import "./sidebar.scss";
import { Link, useLocation } from "react-router-dom";
import { useAuthUser, useSignOut } from "react-auth-kit";

export const Sidebar = () => {
  const pathname = useLocation().pathname.split("/");
  const authUser = useAuthUser();
  const role = authUser().role;
  const signOut = useSignOut();
  const handleSignOut = () => {
    signOut();
  };
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
        {role === "COORDINATOR" && (
          <>
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
            <Link to="/coordinator/shipperList">
              <div
                className={
                  pathname[2] === "shipperList"
                    ? "sidebarItem selected"
                    : "sidebarItem"
                }
              >
                <Group /> Danh sách nhân viên
              </div>
            </Link>
          </>
        )}
        {role === "ADMIN" && (
          <>
            <Link to="/admin">
              <div
                className={
                  pathname[1] === "admin" && !pathname[2]
                    ? "sidebarItem selected"
                    : "sidebarItem"
                }
              >
                <Home /> Trang chủ
              </div>
            </Link>
          </>
        )}
        <div className="sidebarItem" onClick={handleSignOut}>
          <Logout /> Đăng xuất
        </div>
      </div>
    </div>
  );
};
