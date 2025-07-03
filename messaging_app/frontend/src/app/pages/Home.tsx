import { Link } from "react-router";
import { MessageCircle, ShieldCheck, Users } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    {
        image: "https://dummyimage.com/800x400/ddd/555&text=Chat+List+Screenshot",
        title: "Manage all your conversations",
        description:
            "See all your chats in one place. Stay organized and never miss a message with our intuitive conversation list.",
    },
    {
        image: "https://dummyimage.com/800x400/ccc/333&text=Chat+Room+Screenshot",
        title: "Real-time messaging",
        description:
            "Chat instantly with friends, family, or teams. Messages sync in real-time across all your devices.",
    },
    {
        image: "https://dummyimage.com/800x400/bbb/222&text=Profile+Settings+Screenshot",
        title: "Customizable profiles",
        description:
            "Personalize your experience with custom avatars, status messages, and privacy settings that fit your needs.",
    },
];


function FeatureSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
    });

    return (
        <section className="relative max-w-5xl mx-auto px-4">
            <motion.div
                ref={sliderRef}
                className="keen-slider"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {slides.map((slide, idx) => (
                    <div
                        key={idx}
                        className="keen-slider__slide flex flex-col md:flex-row items-center gap-8"
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full md:w-1/2 rounded-lg shadow-lg"
                        />
                        <div className="md:w-1/2">
                            <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                            <p className="text-gray-600">{slide.description}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Arrows */}
            <button
                onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
                className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
                className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex justify-center mt-6 gap-2">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => instanceRef.current?.moveToIdx(idx)}
                        className={`w-3 h-3 rounded-full ${currentSlide === idx ? "bg-indigo-600" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}

function TestimonialCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
    });

    return (
        <div className="relative max-w-2xl mx-auto">
            <motion.div
                ref={sliderRef}
                className="keen-slider"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {[
                    {
                        quote:
                            "OurChat changed how we work — fast, reliable, and simple!",
                        author: "Jane Doe, PM",
                    },
                    {
                        quote:
                            "Amazing app! Chats are secure, instant, and just work.",
                        author: "John Smith, Developer",
                    },
                    {
                        quote:
                            "Love the groups & channels feature — so easy for teams.",
                        author: "Alex Lee, Designer",
                    },
                ].map((t, idx) => (
                    <div key={idx} className="keen-slider__slide px-4">
                        <blockquote className="text-2xl italic text-gray-800 mb-4 text-center">
                            “{t.quote}”
                        </blockquote>
                        <p className="text-gray-600 text-center">— {t.author}</p>
                    </div>
                ))}
            </motion.div>

            {/* Arrows */}
            <button
                onClick={(e) => e.stopPropagation() || instanceRef.current?.prev()}
                className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={(e) => e.stopPropagation() || instanceRef.current?.next()}
                className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex justify-center mt-4 gap-2">
                {[0, 1, 2].map((idx) => (
                    <button
                        key={idx}
                        onClick={() => instanceRef.current?.moveToIdx(idx)}
                        className={`w-3 h-3 rounded-full ${currentSlide === idx ? "bg-indigo-600" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <main className="bg-white text-gray-900 scroll-smooth">
            {/* Hero Section */}
            <motion.section
                className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-20 px-4 sm:px-6 lg:px-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {/* Subtle background pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "url('/topography/topography.svg')" }}
                    aria-hidden="true"
                ></div>

                <div className="relative max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
                        Chat with <span className="text-indigo-600">anyone, anytime.</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-700">
                        Your secure, private, and real-time messaging platform.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link
                            to="/register"
                            className="inline-block px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="inline-block px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition"
                        >
                            Sign In
                        </Link>
                    </div>
                    {/* Example app screenshot */}
                </div>

                <div className="mt-12 md:w-1/2">
                    <img
                        src="/illustrations/undraw_chat_qmyo.svg"
                        alt="Chatting illustration"
                        className="w-full max-w-md mx-auto"
                    />
                </div>

            </motion.section>

            {/* Features Section */}
            <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Why choose OurChat?</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center"
                        >
                            <MessageCircle className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Real-Time Messaging</h3>
                            <p className="text-gray-600">
                                Send and receive messages instantly with lightning-fast WebSocket connections.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-center"
                        >
                            <ShieldCheck className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                            <p className="text-gray-600">
                                End-to-end encryption keeps your chats safe and secure.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="text-center"
                        >
                            <Users className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Groups & Channels</h3>
                            <p className="text-gray-600">
                                Collaborate with friends, family, or your team with easy group chats.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="bg-indigo-50 py-12">
                <motion.img
                    src="/illustrations/undraw_working-together_r43a.svg"
                    alt="..."
                    className="w-full max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                />
            </div>

            {/* Testimonial */}
            <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <blockquote className="text-2xl font-semibold italic text-gray-800 mb-6">
                        “OurChat has completely changed how my team communicates — fast, reliable, and so easy to use.”
                    </blockquote>
                    <p className="text-gray-600">— Jane Doe, Product Manager</p>
                </div>
            </section>

            <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <TestimonialCarousel />
                </div>
            </section>

            <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <FeatureSlider />
                </div>
            </section>

            <div className="bg-indigo-50 py-12">
                <img
                    src="/illustrations/undraw_got-an-idea_1z3i.svg"
                    alt="Group chat illustration"
                    className="w-full max-w-4xl mx-auto"
                />
            </div>

            {/* CTA Section */}
            <motion.section
                className="py-20 px-4 sm:px-6 lg:px-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to start chatting?</h2>
                    <p className="text-gray-600 mb-8">
                        Join thousands of people who trust OurChat every day.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-8 py-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
                    >
                        Create an Account
                    </Link>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} OurChat. All rights reserved.
            </footer>
        </main>
    );
}
