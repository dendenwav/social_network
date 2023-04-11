interface LinkAnimationProps {
    href: string;
    content: String;
}

export const LinkAnimation = ({ href, content }: LinkAnimationProps) => {

    return (
        <a href={href} className="underline">
            <div>{content}<span></span></div>
            <svg viewBox="0 0 10 10" fill="none">
                <polyline points="0.5,9.5 4.8,9.5 9.5,4.8 5.2,0.5" />
            </svg>
        </a>
    );
}