import {
  Add,
  Group,
  Home,
  Logout,
  PeopleAlt,
  ReceiptLong,
  ShoppingCart,
  Warehouse,
} from "@mui/icons-material";
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
            <Link to={"/admin/shops"}>
              <div
                className={
                  pathname[2] === "shops"
                    ? "sidebarItem selected"
                    : "sidebarItem"
                }
              >
                <ShoppingCart/> Danh sách các shop
              </div>
            </Link>
          </>
        )}
        {role === "SHOP" && (
          <>
            <Link to="/shop">
              <div
                className={
                  pathname[1] === "shop" && !pathname[2]
                    ? "sidebarItem selected"
                    : "sidebarItem"
                }
              >
                <Home /> Trang chủ
              </div>
            </Link>
            <Link to={"/shop/createOrder"}>
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
            <Link to={"/shop/manageProducts"}>
              <div
                className={
                  pathname[2] === "manageProducts"
                    ? "sidebarItem selected"
                    : "sidebarItem"
                }
              >
                <Add /> Quản lý hàng
              </div>
            </Link>
            <Link to={"/shop/clients"}>
              <div
                className={
                  pathname[2] === "clients"
                    ? "sidebarItem selected"
                    : "sidebarItem"
                }
              >
                <PeopleAlt /> Danh sách khách hàng
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
