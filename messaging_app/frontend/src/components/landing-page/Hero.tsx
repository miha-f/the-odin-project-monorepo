import { Link } from "react-router";
import { motion } from "motion/react";
import { fadeUp } from "./MotionPresets";
import MotionSection from "./MotionSection";
import MotionImage from "./MotionImage";

export default function Hero() {
    return (
        <MotionSection
            className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-20 px-4 sm:px-6 lg:px-8"
            variants={fadeUp}
        >
            {/* NOTE: Add background heropattern*/}
            < div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "url('/topography/topography.svg')" }}
                aria-hidden="true"
            ></div >

            <div className="relative max-w-5xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
                    Chat with <span className="text-indigo-600">anyone, anytime.</span>
                </h1>
                <p className="mt-4 text-lg text-gray-700">
                    Your secure, private, and real-time messaging platform.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link
                            to="/register"
                            className="inline-block px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
                        >
                            Get Started
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link
                            to="/login"
                            className="inline-block px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition"
                        >
                            Sign In
                        </Link>
                    </motion.div>
                </div>
            </div>

            <div className="mt-12 md:w-1/2">
                <div className="w-full max-w-md aspect-[4/3] mx-auto">
                    <MotionImage
                        src="/illustrations/undraw_chat_qmyo.svg"
                        alt="Chatting illustration"
                        className="w-full max-w-md mx-auto"
                    />
                </div>
            </div>
        </MotionSection >
    )
}
