import Cookies from "js-cookie";
import PublicNavbar from "./Navbar.Public";
import AuthNavbar from "./Navbar.Auth";

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