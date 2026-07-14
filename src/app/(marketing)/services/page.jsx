"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Mic,
  Sparkles,
  Brain,
  Rocket,
  Zap,
  Shield,
  CheckCircle,
  Star,
} from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "PDF Analysis",
    description:
      "Advanced AI-powered PDF analysis with OCR, entity extraction, and summarization.",
    features: [
      "Text Extraction",
      "Entity Recognition",
      "Summarization",
      "Search",
    ],
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    iconBg: "from-blue-500/20 to-blue-600/20",
  },
  {
    icon: Mic,
    title: "Voice Processing",
    description:
      "Real-time speech recognition, transcription, and voice analytics.",
    features: [
      "Speech-to-Text",
      "Voice Analytics",
      "Speaker Diarization",
      "Real-time",
    ],
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    iconBg: "from-purple-500/20 to-purple-600/20",
  },
  {
    icon: Sparkles,
    title: "AI Astro",
    description:
      "Intelligent assistant for astronomical research and data analysis.",
    features: [
      "Star Detection",
      "Data Analysis",
      "Prediction",
      "Visualization",
    ],
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    iconBg: "from-pink-500/20 to-pink-600/20",
  },
  {
    icon: Brain,
    title: "Smart Analytics",
    description:
      "Real-time data analysis with predictive modeling and insights.",
    features: ["Predictive Models", "Real-time", "Visualization", "Automation"],
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-600",
    iconBg: "from-cyan-500/20 to-cyan-600/20",
  },
  {
    icon: Rocket,
    title: "AI Orchestration",
    description: "Scale your AI workloads with enterprise-grade orchestration.",
    features: [
      "Scalability",
      "Workflow Management",
      "Monitoring",
      "Optimization",
    ],
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    iconBg: "from-orange-500/20 to-orange-600/20",
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    description:
      "Enterprise-grade security with data encryption and privacy controls.",
    features: ["Encryption", "Compliance", "Audit Logs", "Access Control"],
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    iconBg: "from-green-500/20 to-green-600/20",
  },
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 via-white to-white/90 pt-24 px-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Back Button */}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Our Services
            </span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Comprehensive AI solutions designed to transform your business.
          </p>

          {/* Decorative line */}
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-zinc-200/50 hover:border-blue-200/50 shadow-lg shadow-zinc-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <service.icon className={`w-7 h-7 ${service.textColor}`} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${service.bgColor} ${service.textColor} transition-all duration-200 group-hover:scale-105`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {feature}
                  </span>
                ))}
              </div>

              {/* Decorative gradient line on hover */}
              <div
                className={`mt-4 w-12 h-0.5 bg-gradient-to-r ${service.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl border border-white/50 p-12 shadow-lg shadow-blue-500/5">
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">
              Need a Custom Solution?
            </h3>
            <p className="text-zinc-600 mb-6 max-w-md mx-auto">
              Let's discuss how we can tailor our services to meet your specific
              needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
