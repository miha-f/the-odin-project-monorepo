import { Outlet } from "react-router-dom";
import Theme from "./Theme";

const AuthLayout = () => {
    return (
        <Theme>
            <Outlet />
        </Theme>
    );
};

export default AuthLayout;
