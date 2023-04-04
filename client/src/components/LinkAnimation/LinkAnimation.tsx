interface LinkAnimationProps {
    href: string;
    content: String;
    height: string;
}

export const LinkAnimation = ({ href, content, height }: LinkAnimationProps) => {

    return (
        <a href={href} className="underline">
            <span style={{fontSize: `${height}`, height: `${height}`}}>{content}</span>
            <svg height={height} viewBox="0 0 10 10" fill="none" stroke="red">
                <polyline points="0.5,9.5 4.8,9.5 9.5,4.8 5.2,0.5" />
            </svg>
        </a>
    );
}