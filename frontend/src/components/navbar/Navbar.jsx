import Cookies from "js-cookie";
import PublicNavbar from "./PublicNavbar";
import AuthNavbar from "./AuthNavbar";

const Navbar = () => {
    const access = Cookies.get("accessToken");

    return (
        <>
            { !access && <PublicNavbar /> }
            { access &&  <AuthNavbar />}
        </>
        
    );
}
export default Navbar;