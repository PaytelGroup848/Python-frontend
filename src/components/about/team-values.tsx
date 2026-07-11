"use client";

import { motion } from "framer-motion";
import { Users, Target, Award, TrendingUp } from "lucide-react";

const teamValues = [
  {
    icon: Users,
    title: "Our Team",
    description:
      "Passionate engineers and AI researchers from around the world.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Target,
    title: "Our Mission",
    description: "Democratize AI and make it accessible to everyone.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Award,
    title: "Our Values",
    description:
      "Innovation, transparency, and excellence in everything we do.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Our Vision",
    description: "Build the future of human-AI collaboration.",
    color: "from-orange-500 to-amber-600",
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function TeamValues() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {teamValues.map((item, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.2 } }}
          className="group p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-zinc-200/50 hover:border-blue-200/50 shadow-lg shadow-zinc-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <item.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            {item.title}
          </h3>
          <p className="text-zinc-600 leading-relaxed">{item.description}</p>

          {/* Decorative line on hover */}
          <div className="mt-4 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
      ))}
    </div>
  );
}
