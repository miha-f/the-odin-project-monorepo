import { Link } from "react-router-dom";
import "keen-slider/keen-slider.min.css";
import { motion } from "motion/react";
import Hero from "@/components/landing-page/Hero";
import Features from "@/components/landing-page/Features";
import MotionImage from "@/components/landing-page/MotionImage";
import Carousel from "@/components/Carousel";

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
    return (
        <section className="max-w-5xl mx-auto px-4">
            <Carousel>
                {slides.map((slide) => (
                    <div
                        key={slide.title}
                        className="flex flex-col md:flex-row items-center gap-8"
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
            </Carousel>
        </section>
    );
}

function TestimonialCarousel() {
    return (
        <Carousel className="max-w-2xl mx-auto">
            <div>
                <blockquote className="text-2xl italic text-gray-800 mb-4 text-center">
                    “OurChat changed how we work — fast, reliable, and simple!”
                </blockquote>
                <p className="text-gray-600 text-center">— Jane Doe, PM</p>
            </div>
            <div>
                <blockquote className="text-2xl italic text-gray-800 mb-4 text-center">
                    “Amazing app! Chats are secure, instant, and just work.”
                </blockquote>
                <p className="text-gray-600 text-center">— John Smith, Developer</p>
            </div>
            <div>
                <blockquote className="text-2xl italic text-gray-800 mb-4 text-center">
                    “Love the groups & channels feature — so easy for teams.”
                </blockquote>
                <p className="text-gray-600 text-center">— Alex Lee, Designer</p>
            </div>
        </Carousel>
    );
}

export default function Home() {
    return (
        <main className="bg-white text-gray-900 scroll-smooth">
            <Hero />
            <Features />

            <div className="bg-indigo-50 py-12">
                <MotionImage
                    src="/illustrations/undraw_working-together_r43a.svg"
                    alt="..."
                    className="w-full max-w-4xl mx-auto"
                />
            </div>

            <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <TestimonialCarousel />
                </div>
            </section>

            <div className="bg-indigo-50 py-12">
                <MotionImage
                    src="/illustrations/undraw_got-an-idea_1z3i.svg"
                    alt="Group chat illustration"
                    className="w-full max-w-4xl mx-auto"
                />
            </div>

            <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <FeatureSlider />
                </div>
            </section>

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
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link
                            to="/register"
                            className="inline-block px-8 py-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
                        >
                            Create an Account
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="py-8 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} OurChat. All rights reserved.
            </footer>
        </main>
    );
}
