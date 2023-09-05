import { Wifi, SignalCellularAlt, HeadphonesRounded, Home, CalendarToday, Settings } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Link, useLocation } from "react-router-dom";

import "./ShipperAllOrders.scss";

const ShipperAllOrders = () => {
    const pathname = useLocation().pathname.split("/");
    return (
        <>
            <div className="topBar">
                <div className="leftTopBar">9:41</div>
                <div className="rightTopBar">
                    <SignalCellularAlt />
                    <Wifi />
                    <HeadphonesRounded />
                </div>
            </div>
            <div className='orderContainer'>
                <div className='topMenu'>
                    <div className='topMenuTitle'>Đơn hàng</div>
                    <div className='topMenuButton'>
                        <Link to="/shipper">
                            <div
                                className={
                                    pathname[1] === "shipper" && !pathname[2]
                                        ? "sidebarItem selected"
                                        : "sidebarItem"
                                }
                            >
                                Tất cả
                            </div>
                        </Link>
                        <Link to="/shipper/shipping">
                            <div
                                className={
                                    pathname[2] === "shipping"
                                        ? "sidebarItem selected"
                                        : "sidebarItem"
                                }
                            >
                                Đang giao
                            </div>
                        </Link>
                        <Link to="/shipper/success">
                            <div
                                className={
                                    pathname[2] === "success"
                                        ? "sidebarItem selected"
                                        : "sidebarItem"
                                }
                            >
                                Thành công
                            </div>
                        </Link>
                    </div>
                    <div className='topMenuDate'>Tomorrow</div>
                </div>
                <div className='orderList'>
                    <div className='orderListItem'>
                        <div className='orderTop'>
                            <div className='orderDate'>
                                <div className='orderDay'>12</div>
                                <div className='orderMonth'>May</div>
                            </div>
                            <div className='orderInfo'>
                                <div className='orderWarehouse'>Kho 1</div>
                                <div className='orderAddress'>268 Đội Cấn</div>
                                <div className='orderCode'>123GHF7AD9</div>
                            </div>
                            <div className='orderCurrentStatus'>Đang lấy hàng</div>
                        </div>
                        <div className='orderChangeStatus'>
                            <Button variant="contained">Chuyển trạng thái</Button>
                        </div>
                    </div>
                </div>
                <div className='orderList'>
                    <div className='orderListItem'>
                        <div className='orderTop'>
                            <div className='orderDate'>
                                <div className='orderDay'>12</div>
                                <div className='orderMonth'>May</div>
                            </div>
                            <div className='orderInfo'>
                                <div className='orderWarehouse'>Kho 1</div>
                                <div className='orderAddress'>268 Đội Cấn</div>
                                <div className='orderCode'>123GHF7AD9</div>
                            </div>
                            <div className='orderCurrentStatus'>Đang lấy hàng</div>
                        </div>
                        <div className='orderChangeStatus'>
                            <Button variant="contained">Chuyển trạng thái</Button>
                        </div>
                    </div>
                </div>
                <div className='orderList'>
                    <div className='orderListItem'>
                        <div className='orderTop'>
                            <div className='orderDate'>
                                <div className='orderDay'>12</div>
                                <div className='orderMonth'>May</div>
                            </div>
                            <div className='orderInfo'>
                                <div className='orderWarehouse'>Kho 1</div>
                                <div className='orderAddress'>268 Đội Cấn</div>
                                <div className='orderCode'>123GHF7AD9</div>
                            </div>
                            <div className='orderCurrentStatus'>Đang lấy hàng</div>
                        </div>
                        <div className='orderChangeStatus'>
                            <Button variant="contained">Chuyển trạng thái</Button>
                        </div>
                    </div>
                </div>
                <div className='botBar'>
                    <Link to="/shipper">
                        <div className='botBarItem'>
                            <Home /> Trang chủ
                        </div>
                    </Link>
                    <Link to="/shipper">
                        <div className='botBarItem'>
                            <CalendarToday /> Đơn hàng
                        </div>
                    </Link>
                    <Link to="/shipper">
                        <div className='botBarItem'>
                            <Settings /> Tài khoản
                        </div>
                    </Link>
                </div>
            </div>

        </>
    );
};

export default ShipperAllOrders;