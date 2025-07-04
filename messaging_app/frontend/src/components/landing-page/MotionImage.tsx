import { motion } from "motion/react";

type Props = {
    src: string;
    alt: string;
    className?: string;
};

export default function MotionImage({ src, alt, className }: Props) {
    return (
        <motion.img
            src={src}
            alt={alt}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className={`${className}`}
        />
    )
}
