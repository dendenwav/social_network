import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import Topbar from "../../../components/topbar/Topbar";

type AuthenticatedPagesContainerProps = {
    children: ReactJSXElement
}

const AuthenticatedPagesContainer = ({ children }: AuthenticatedPagesContainerProps) => {
    return (
        <>
            <Topbar/>
            {children}

        </>
    )
};

export default AuthenticatedPagesContainer;