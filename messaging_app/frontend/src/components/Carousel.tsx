import { useState, type ReactNode, Children } from "react";
import { useKeenSlider } from "keen-slider/react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
    children: ReactNode;
    className?: string;
};

export default function Carousel({ children, className }: CarouselProps) {
    const slidesCount = Children.count(children);
    const [currentSlide, setCurrentSlide] = useState(0);

    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
    });

    return (
        <div className={`relative ${className}`}>
            <motion.div
                ref={sliderRef}
                className="keen-slider"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {Children.map(children, (child, idx) => (
                    <div key={idx} className="keen-slider__slide px-4">
                        {child}
                    </div>
                ))}
            </motion.div>

            {/* Bottom controls container */}
            <div className="mt-6 flex justify-center items-center gap-4">
                {/* Left Arrow */}
                <button
                    onClick={(e) => { e.stopPropagation(); instanceRef.current?.prev(); }}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="flex items-center gap-2">
                    {Array.from({ length: slidesCount }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={`w-3 h-3 rounded-full transition-colors ${currentSlide === idx ? "bg-indigo-600" : "bg-gray-300"
                                }`}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={(e) => { e.stopPropagation(); instanceRef.current?.next(); }}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
