import { MessageCircle, ShieldCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import { fadeUpStagger, fadeUpItem } from "./MotionPresets";

export default function Features() {
    return (
        <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Why choose OurChat?</h2>
                <motion.div
                    variants={fadeUpStagger}
                    initial="hidden"
                    whileInView="visible"
                    className="grid md:grid-cols-3 gap-12"
                >
                    <motion.div
                        variants={fadeUpItem}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        className="text-center"
                    >
                        <MessageCircle className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Real-Time Messaging</h3>
                        <p className="text-gray-600">
                            Send and receive messages instantly with lightning-fast WebSocket connections.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={fadeUpItem}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        className="text-center"
                    >
                        <ShieldCheck className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                        <p className="text-gray-600">
                            End-to-end encryption keeps your chats safe and secure.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={fadeUpItem}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        className="text-center"
                    >
                        <Users className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Groups & Channels</h3>
                        <p className="text-gray-600">
                            Collaborate with friends, family, or your team with easy group chats.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
