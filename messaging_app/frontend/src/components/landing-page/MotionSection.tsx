import { motion, type Variants } from "motion/react";

type Props = {
    children: React.ReactNode;
    variants: Variants;
    className?: string;
}

export default function MotionSection({ children, variants, className }: Props) {
    return (
        <motion.section
            className={`${className}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={variants}
        >
            {children}
        </motion.section>
    )
}
