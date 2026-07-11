"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  Sparkles,
} from "lucide-react";

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
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

const formVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 via-white to-white/90 pt-24 px-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Contact Us
            </span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Get in touch with our team. We'd love to hear from you.
          </p>

          {/* Decorative line */}
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Contact Information */}
          <motion.div variants={staggerContainer} className="space-y-6">
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-zinc-200/50 hover:border-blue-200/50 shadow-lg shadow-zinc-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">Email</h3>
                  <p className="text-zinc-600 hover:text-blue-600 transition-colors">
                    support@cloudedata.com
                  </p>
                  <p className="text-zinc-500 text-sm mt-1">
                    We respond within 24 hours
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-zinc-200/50 hover:border-purple-200/50 shadow-lg shadow-zinc-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">Phone</h3>
                  <p className="text-zinc-600 hover:text-purple-600 transition-colors">
                    +91 9311472355
                  </p>
                  <div className="flex items-center gap-1 text-zinc-500 text-sm mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Mon-Sat 10am-7pm IST</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-zinc-200/50 hover:border-pink-200/50 shadow-lg shadow-zinc-500/5 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">Location</h3>
                  <p className="text-zinc-600 hover:text-pink-600 transition-colors">
                    India
                  </p>
                  <p className="text-zinc-500 text-sm mt-1">
                    New Delhi – 110020
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Availability Badge */}
            <motion.div
              variants={cardVariants}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-green-50/80 to-emerald-50/80 border border-green-200/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm font-medium text-zinc-700">
                    We're online and ready to help
                  </p>
                  <p className="text-xs text-zinc-500">
                    Average response time: 2 minutes
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={formVariants}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-8 mb-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-zinc-200/50 shadow-lg shadow-zinc-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-semibold text-zinc-900">
                Send us a message
              </h2>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border-2 border-zinc-200/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 placeholder:text-zinc-400 text-zinc-900"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border-2 border-zinc-200/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 placeholder:text-zinc-400 text-zinc-900"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border-2 border-zinc-200/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200 placeholder:text-zinc-400 text-zinc-900 resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 inline-flex items-center justify-center gap-2"
              >
                Send Message
                <Send className="w-4 h-4" />
              </motion.button>

              <p className="text-xs text-center text-zinc-500">
                We'll never share your information with third parties.
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
