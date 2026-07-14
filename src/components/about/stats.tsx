"use client";

import { motion } from "framer-motion";
import { Users, Globe, Bot, Zap } from "lucide-react";

const stats = [
  {
    label: "Active Users",
    value: "50K+",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Countries",
    value: "120+",
    icon: Globe,
    color: "from-green-500 to-emerald-600",
  },
  {
    label: "AI Models",
    value: "100+",
    icon: Bot,
    color: "from-purple-500 to-purple-600",
  },
  {
    label: "API Calls",
    value: "1B+",
    icon: Zap,
    color: "from-orange-500 to-amber-600",
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Stats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="group text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-zinc-200/50 hover:border-blue-200/50 shadow-lg shadow-zinc-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div
            className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-600 bg-clip-text text-transparent">
            {stat.value}
          </div>
          <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
