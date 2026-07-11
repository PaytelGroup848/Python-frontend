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
  CreditCard,
  Scale,
  Mail,
  MapPin,
  Globe,
  BookOpen,
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

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "1. Overview",
      content:
        "We, Us, Our refer to Cloude Data. You, User, Customer refer to any individual or legal entity using our services. Services refer to all products and solutions offered by Cloude Data. This Agreement does not create any third-party rights.",
    },
    {
      icon: BookOpen,
      title: "2. Definitions",
      content:
        "We, Us, Our = Cloude Data; You, User, Customer = individual or entity using services; Services = all products and solutions. This Agreement does not create any third-party rights.",
    },
    {
      icon: AlertCircle,
      title: "3. Modifications to Terms",
      content:
        "Cloude Data reserves the right to modify these Terms at any time. Updated terms become effective immediately once posted on the website. Continued use of the website or services after updates indicates acceptance of the revised terms.",
    },
    {
      icon: Shield,
      title: "4. Eligibility & Authority",
      content:
        "By using our services, you confirm that: (1) you are at least 18 years of age; (2) you are legally capable of entering binding contracts; (3) you are not restricted under Indian or international law; and (4) if acting on behalf of an organization, you have the legal authority to bind that organization to these Terms.",
    },
    {
      icon: Globe,
      title: "5. Sanctions Compliance",
      content:
        "You represent that you are not subject to sanctions imposed by India, the United States, the European Union, the United Nations, or other governing authorities. Cloude Data reserves the right to suspend or terminate services immediately if sanctions violations are suspected.",
    },
    {
      icon: Lock,
      title: "6. Account Registration & Security",
      content:
        "To access certain services, you must create an account. You agree to provide accurate and complete information, maintain confidentiality of login credentials, and notify us immediately of unauthorized access. You are solely responsible for all activities that occur under your account.",
    },
    {
      icon: Server,
      title: "7. International Data Transfer",
      content:
        "By accessing our website or services, you consent to the transfer, storage, and processing of data across international borders, including servers located outside your country.",
    },
    {
      icon: Users,
      title: "8. Account Sharing & Access Permissions",
      content:
        "Users may grant limited access to trusted individuals. However, the account holder remains fully responsible for all actions taken through the account, and Cloude Data is not responsible for disputes between account holders and authorized users.",
    },
    {
      icon: CheckCircle,
      title: "9. Service Availability",
      content:
        "Cloude Data aims to provide services 24/7. However, service availability may be affected by scheduled maintenance, technical failures, or events beyond our control. We do not guarantee uninterrupted service and are not liable for downtime.",
    },
    {
      icon: AlertCircle,
      title: "10. Acceptable Use Policy",
      content:
        "You agree not to use Cloude Data services for: illegal activities, child exploitation, terrorism, spam, malware distribution, cryptocurrency mining without permission, intellectual property violations, false claims, or activities threatening national security. Violations may result in immediate suspension or termination.",
    },
    {
      icon: Scale,
      title: "11. Intellectual Property Rights",
      content:
        "All content, software, trademarks, designs, and materials on the website are owned or licensed by Cloude Data and protected under intellectual property laws. You may not copy, reproduce, modify, or distribute any materials without written permission.",
    },
    {
      icon: FileText,
      title: "12. User Content",
      content:
        "You retain ownership of the content you host using our services. However, by uploading content, you grant Cloude Data a limited license to host and process the content solely for service delivery. You are responsible for ensuring that your content does not violate third-party rights.",
    },
    {
      icon: Shield,
      title: "13. Monitoring & Termination",
      content:
        "Cloude Data reserves the right to monitor hosted content, remove prohibited materials, and suspend or terminate accounts without prior notice. Repeated violations may result in permanent service termination.",
    },
    {
      icon: AlertCircle,
      title: "14. No Spam Policy",
      content:
        "Sending spam, bulk messages, or unsolicited communications using Cloude Data services is strictly prohibited. Violations will result in immediate service suspension or termination.",
    },
    {
      icon: Globe,
      title: "15. Third-Party Links",
      content:
        "Our website may contain links to third-party websites. Cloude Data is not responsible for their content, policies, or practices. Use third-party websites at your own risk.",
    },
    {
      icon: Sparkles,
      title: "16. AI & Automated Tools",
      content:
        "Cloude Data may provide AI-based tools and automation features. Users are responsible for reviewing AI-generated outputs before using them. Sensitive or confidential data should not be uploaded to AI tools.",
    },
    {
      icon: AlertCircle,
      title: "17. Disclaimer of Warranties",
      content:
        "All services are provided 'as is' and 'as available' without warranties of any kind. Cloude Data does not guarantee uninterrupted service or accuracy of information.",
    },
    {
      icon: Scale,
      title: "18. Limitation of Liability",
      content:
        "To the maximum extent permitted by law, Cloude Data will not be liable for loss of data, business interruption, loss of profits, or indirect damages. Total liability shall not exceed the amount paid by the user in the previous 12 months or ₹100,000, whichever is lower.",
    },
    {
      icon: Shield,
      title: "19. Indemnification",
      content:
        "You agree to indemnify and hold Cloude Data harmless against claims arising from your use of services, violation of this Agreement, or infringement of third-party rights.",
    },
    {
      icon: AlertCircle,
      title: "20. Discontinued Services",
      content:
        "Cloude Data may discontinue services at any time. Where possible, customers will receive advance notice and may be provided with migration or refund options depending on the situation.",
    },
    {
      icon: CreditCard,
      title: "21. Fees, Payments & Renewals",
      content:
        "All prices exclude applicable taxes. Services may automatically renew unless disabled. Refunds are governed by the Refund Policy. Non-payment may result in suspension or termination.",
    },
    {
      icon: Scale,
      title: "22. Governing Law & Jurisdiction",
      content:
        "These Terms are governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi.",
    },
    {
      icon: Mail,
      title: "23. Contact Information",
      content:
        "Email: info@patwatoli.com\nAddress: Okhla Industrial Estate, Phase 3, New Delhi – 110020, India",
    },
  ];

  const erpSections = [
    {
      title: "24.1 Scope of Services",
      content:
        "Secure cloud-hosted access to Accounting ERP solutions including storage and management of client accounting data on dedicated cloud servers.",
    },
    {
      title: "24.2 Data Responsibility & Security",
      content:
        "Cloude Data maintains uptime and data protection. In case of cyber-attack, the most recent verified backup will be restored. Liability is limited to restoration up to the latest available backup.",
    },
    {
      title: "24.3 Client Conduct & Liability",
      content:
        "Clients must use services responsibly and lawfully. Abusive, unlawful, or inappropriate conduct may result in service suspension or termination.",
    },
    {
      title: "24.4 Data Access & Client Control",
      content:
        "Cloude Data does not access, modify, or control client data stored in the assigned cloud environment. Clients retain full responsibility for managing, copying, editing, and deleting their data.",
    },
    {
      title: "24.5 Malicious File Policy",
      content:
        "Uploading malicious or harmful files is strictly prohibited. If such actions cause damage or service interruption, the client will be fully liable for losses and associated recovery costs.",
    },
    {
      title: "24.6 Backup Policy",
      content:
        "Client data is backed up regularly (typically daily). In case of data loss, restoration will occur within 6–24 hours from the latest available backup.",
    },
    {
      title: "24.7 Server Maintenance & Downtime",
      content:
        "Emergency maintenance may occur when required for system stability. Where possible, at least 1 hour prior notice will be provided.",
    },
    {
      title: "24.8 Support Availability",
      content:
        "Support is available Monday–Saturday, 10:00 AM – 7:30 PM IST. All support requests must be submitted through the official support portal or support email.",
    },
    {
      title: "24.9 No Refund Policy",
      content:
        "All payments made to Patwatoli are non-refundable, including cases of cancellation, dissatisfaction, or downtime caused by third-party or client-side issues.",
    },
    {
      title: "24.10 Fees & Payment",
      content:
        "Clients must pay the service fees as specified in their billing invoice, plan, and subscription period.",
    },
    {
      title: "24.11 Term, Renewal & Termination",
      content:
        "Services automatically renew unless either party provides 30 days written notice. Upon termination, clients will have 2–3 days to export their data.",
    },
    {
      title: "24.12 Governing Law & Jurisdiction",
      content:
        "These service-specific terms are governed by the laws of India, and disputes fall under the courts of New Delhi.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 via-white to-white/90 pt-24 px-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl"></div>
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
            <Scale className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-zinc-700">
              Legal Agreement
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Terms of Service
            </span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Please read this agreement carefully, as it contains important
            information regarding your legal rights and remedies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              info@patwatoli.com
            </span>
            <span className="hidden sm:block">•</span>
            <span>www.patwatoli.com</span>
            <span className="hidden sm:block">•</span>
            <span>Effective: July 11, 2026</span>
          </div>

          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* All Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: index * 0.03 }}
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
                  <p className="text-zinc-600 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Service-Specific Terms - Patwatoli Accounting ERP */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.4 }}
            className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-200/50 shadow-lg shadow-blue-500/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <Server className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-zinc-900">
                24. Service-Specific Terms – Patwatoli Accounting ERP on Cloud
              </h2>
            </div>

            <div className="space-y-4">
              {erpSections.map((section, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 hover:border-blue-200/50 transition-all duration-300"
                >
                  <h4 className="font-semibold text-zinc-800 mb-1">
                    {section.title}
                  </h4>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer Section */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-white/50 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="text-zinc-700">Questions? Contact us at</span>
              <a
                href="mailto:info@patwatoli.com"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                info@patwatoli.com
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500">
              <span>www.patwatoli.com</span>
              <span>•</span>
              <span>Last updated: July 11, 2026</span>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-200/50">
              <p className="text-xs text-zinc-400">
                © 2026 Patwatoli. All rights reserved.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
