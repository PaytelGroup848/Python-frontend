"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Lock,
  Server,
  Globe,
  Mail,
  MapPin,
  Building,
  Eye,
  Database,
  Clock,
  Scale,
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

export default function PrivacyPage() {
  const sections = [
    {
      icon: FileText,
      title: "1. Overview",
      content: `This Universal Terms of Service Agreement ("Agreement") is entered into between Cloudedata and you ("User") and becomes effective on the date you access our website or electronically accept these terms.

Unless stated otherwise, the contracting entity is:

Paytel Terminal Pvt. Ltd.

Registered Address: Okhla Industrial Estate, Phase 3, New Delhi – 110020, India

This Agreement governs your use of:
• The Cloudedata website ("Site")
• All products and services provided by Cloudedata ("Services")

Your use of the Site or Services confirms that you have read and understood this Agreement, agree to comply with all applicable policies, and are using our Services for commercial or professional purposes. Cloudedata reserves the right to update or modify these terms at any time; continued use constitutes acceptance.`,
    },
    {
      icon: Shield,
      title: "2. Eligibility & Authority",
      content: `To use Cloudedata Services, you confirm that:
• You are at least 18 years of age
• You are legally capable of entering into binding agreements
• You are not prohibited under applicable laws of India or other jurisdictions

If you accept this Agreement on behalf of a business or legal entity, you confirm that you have full authority to bind that entity to these terms. You remain responsible for all activities conducted through your account.`,
    },
    {
      icon: Globe,
      title: "3. Sanctions & Compliance",
      content: `You represent and warrant that you are not located in, resident of, or operating from a sanctioned country, nor affiliated with any sanctioned individual or entity. You will not use Cloudedata Services for or on behalf of any sanctioned party.

Cloudedata reserves the right to conduct sanctions screening, request verification information, and suspend or terminate Services immediately if sanctions violations are detected. You agree to indemnify Cloudedata against any losses arising from non-compliance.`,
    },
    {
      icon: Lock,
      title: "4. Account Registration & Security",
      content: `To access certain Services, you must create a Cloudedata account. You agree to provide accurate and complete account information, keep login credentials secure, and update information promptly.

Security recommendation: Change your password at least once every six (6) months.

Cloudedata is not responsible for losses resulting from unauthorised access caused by your failure to secure your credentials.`,
    },
    {
      icon: Users,
      title: "5. Account Access & Sharing",
      content: `Cloudedata allows controlled account access to trusted third parties. By granting access, you acknowledge that access is provided at your own risk, authorised users may view limited personal and billing information, and certain critical actions remain restricted.

You assume full legal and financial responsibility for actions taken by authorised users. Cloudedata is not responsible for disputes between account holders and authorised third parties.`,
    },
    {
      icon: Server,
      title: "6. International Data Transfers",
      content: `If you access Cloudedata Services from outside the country where our servers are located, your data may be transferred across international borders. By using our Services, you consent to such transfers in compliance with applicable data protection laws.`,
    },
    {
      icon: Clock,
      title: "7. Service Availability",
      content: `Cloudedata aims to provide services 24/7, using commercially reasonable efforts. However, you acknowledge that services may occasionally be unavailable due to scheduled maintenance, system upgrades, network failures, cybersecurity incidents, or events beyond our reasonable control.

Cloudedata does not guarantee uninterrupted availability and shall not be liable for downtime beyond its reasonable control.`,
    },
    {
      icon: Sparkles,
      title: "8. Pre-Release & Beta Services",
      content: `From time to time, Cloudedata may offer beta services or limited preview features. These services are provided "as-is" and may be modified or discontinued at any time.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 via-white to-white/90 pt-24 px-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl"></div>

        {/* Floating particles */}
      </div>

      <div className="max-w-5xl mx-auto relative">
        

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-zinc-200/50 rounded-full mb-6">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-zinc-700">
              Legal Document
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Privacy & Terms
            </span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Please read this agreement carefully, as it contains important
            information regarding your legal rights and remedies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              support@cloudedata.com
            </span>
            <span className="hidden sm:block">•</span>
            <span>www.cloudedata.com</span>
            <span className="hidden sm:block">•</span>
            <span>Effective: July 11, 2026</span>
          </div>

          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </motion.div>

        {/* Company Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-200/50 shadow-lg shadow-blue-500/5"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                Contracting Entity
              </h3>
              <p className="text-zinc-700 font-medium">
                Paytel Terminal Pvt. Ltd.
              </p>
              <p className="text-zinc-600 text-sm mt-1">
                Registered Address: Okhla Industrial Estate, Phase 3, New Delhi
                – 110020, India
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-zinc-200/50 hover:border-blue-200/50 shadow-lg shadow-zinc-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <section.icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                    {section.title}
                  </h3>
                  <div className="text-zinc-600 leading-relaxed whitespace-pre-line">
                    {section.content.split("\n").map((line, i) => {
                      if (line.trim().startsWith("•")) {
                        return (
                          <div
                            key={i}
                            className="flex items-start gap-2 ml-2 mt-1"
                          >
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{line.trim().substring(1).trim()}</span>
                          </div>
                        );
                      }
                      return line ? (
                        <p key={i} className="mt-1">
                          {line}
                        </p>
                      ) : (
                        <br key={i} />
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-white/50 text-center"
        >
          <h3 className="text-xl font-semibold text-zinc-900 mb-4">
            Contact Information
          </h3>
          <p className="text-zinc-600 mb-2">
            For questions regarding these Terms of Service, please contact:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <a
              href="mailto:support@cloudedata.com"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              <Mail className="w-4 h-4" />
              support@cloudedata.com
            </a>
            <span className="hidden sm:block text-zinc-300">|</span>
            <span className="text-zinc-500">www.cloudedata.com</span>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-200/50">
            <p className="text-xs text-zinc-400">Last updated: July 11, 2026</p>
            <p className="text-xs text-zinc-400 mt-1">
              © 2026 Cloudedata. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
