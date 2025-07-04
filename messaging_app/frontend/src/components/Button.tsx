import { Link } from "react-router";

type Props = {
    text: string;
    to: string;
    bg?: string;
    textColor?: string;
    hoverBg?: string;
    className?: string;
};

export default function Button({ text, to, bg, textColor, hoverBg, className }: Props) {

    return (
        <Link
            to={to}
            className={
                `inline-block px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition
                ${bg} ${textColor} ${hoverBg} ${className}
                `}
        >
            {text}
        </Link>
    )
}
