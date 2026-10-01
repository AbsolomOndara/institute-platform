import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import RouteProgress from "../components/common/RouteProgress";
export default function PublicLayout() { return <><RouteProgress /><Navbar /><Outlet /><Footer /></>; }
