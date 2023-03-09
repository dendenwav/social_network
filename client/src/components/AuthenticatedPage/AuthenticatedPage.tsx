import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import Topbar from "../Topbar/Topbar";

type AuthenticatedPagesContainerProps = {
    children: ReactJSXElement,
    userId?: string
}

const AuthenticatedPage = ({ children, userId }: AuthenticatedPagesContainerProps) => {
    if (!userId) {
        return (
            <>
                <Topbar/>
                {children}
            </>
        )
    }

    return (
        <>
            <Topbar userId={userId}/>
            {children}
        </>
    )
};

export default AuthenticatedPage;