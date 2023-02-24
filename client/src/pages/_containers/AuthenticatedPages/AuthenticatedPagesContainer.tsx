import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

type AuthenticatedPagesContainerProps = {
    children: ReactJSXElement
}

const AuthenticatedPagesContainer = ({ children }: AuthenticatedPagesContainerProps) => {
    return (
        <div>

            {children}

        </div>
    )
};

export default AuthenticatedPagesContainer;