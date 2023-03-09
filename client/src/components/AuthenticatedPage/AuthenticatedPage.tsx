import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import Topbar from "../Topbar/Topbar";

type AuthenticatedPagesContainerProps = {
    children: ReactJSXElement
}

const AuthenticatedPage = ({ children }: AuthenticatedPagesContainerProps) => {
    return (
        <>
            <Topbar/>
            {children}
        </>
    )
};

export default AuthenticatedPage;