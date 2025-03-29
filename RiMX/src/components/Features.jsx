import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Users, 
  BarChart2, 
  Settings, 
  Globe, 
  Lock,
  Code,
  Server,
  GitBranch,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  ArrowLeft
} from 'lucide-react';

const Features = () => {
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [expandedUseCase, setExpandedUseCase] = useState(null);

  const features = [
    {
      icon: <Layers size={40} />,
      title: "Project Management",
      description: "End-to-end project tracking with customizable workflows, Gantt charts, and milestone tracking",
      highlights: [
        "Drag-and-drop task management",
        "Automated progress tracking",
        "Resource allocation tools",
        "Time tracking integration",
        "Custom status workflows"
      ],
      videoDemo: "https://www.youtube.com/embed/project-management-demo"
    },
    {
      icon: <Users size={40} />,
      title: "Team Collaboration",
      description: "Real-time communication and file sharing designed for distributed teams",
      highlights: [
        "Integrated chat and comments",
        "@mentions and notifications",
        "Role-based permissions",
        "File versioning",
        "Simultaneous document editing"
      ],
      videoDemo: "https://www.youtube.com/embed/team-collab-demo"
    },
    {
      icon: <BarChart2 size={40} />,
      title: "Advanced Analytics",
      description: "Actionable insights with customizable dashboards and reports",
      highlights: [
        "Real-time performance metrics",
        "Forecasting tools",
        "Exportable reports",
        "Custom KPI tracking",
        "Data visualization"
      ],
      videoDemo: "https://www.youtube.com/embed/analytics-demo"
    },
    {
      icon: <Settings size={40} />,
      title: "Custom Workflows",
      description: "Tailor the platform to match your exact business processes",
      highlights: [
        "Visual workflow builder",
        "Automation rules",
        "Approval processes",
        "Conditional logic",
        "API triggers"
      ],
      videoDemo: "https://www.youtube.com/embed/workflows-demo"
    },
    {
      icon: <Globe size={40} />,
      title: "Global Accessibility",
      description: "Cloud-based access from anywhere with offline capabilities",
      highlights: [
        "Multi-language support",
        "Region-specific compliance",
        "99.9% uptime SLA",
        "Offline mode",
        "Local data centers"
      ],
      videoDemo: "https://www.youtube.com/embed/accessibility-demo"
    },
    {
      icon: <Lock size={40} />,
      title: "Enterprise Security",
      description: "Military-grade protection for your sensitive data",
      highlights: [
        "SOC 2 Type II certified",
        "End-to-end encryption",
        "GDPR compliant",
        "Audit logging",
        "IP restrictions"
      ],
      videoDemo: "https://www.youtube.com/embed/security-demo"
    }
  ];

  const useCases = [
    {
      industry: "Financial Services",
      icon: "💳",
      features: ["Compliance tracking", "Audit logging", "Risk management workflows"],
      description: "RiMX helps financial institutions maintain rigorous compliance standards while streamlining operations across distributed teams."
    },
    {
      industry: "Healthcare",
      icon: "🏥",
      features: ["HIPAA compliance", "Patient data management", "Cross-team collaboration"],
      description: "Healthcare providers trust RiMX for secure patient data handling and coordination between departments and facilities."
    },
    {
      industry: "Technology",
      icon: "💻",
      features: ["DevOps integration", "Release management", "Incident response"],
      description: "Tech teams use RiMX to coordinate development cycles, track bugs, and manage complex product roadmaps."
    },
    {
      industry: "Education",
      icon: "🎓",
      features: ["Student progress tracking", "Department coordination", "Research management"],
      description: "Educational institutions leverage RiMX to organize curricula, track student outcomes, and manage research projects."
    }
  ];

  const technicalFeatures = [
    {
      title: "API-First Design",
      description: "RESTful API with comprehensive documentation and SDKs for all major languages",
      icon: <Code className="h-5 w-5 text-blue-400" />
    },
    {
      title: "Global Infrastructure",
      description: "Deployed across 12 AWS regions with automatic failover and load balancing",
      icon: <Server className="h-5 w-5 text-purple-400" />
    },
    {
      title: "Role-Based Access",
      description: "Granular permissions with custom roles and audit logging for all actions",
      icon: <Lock className="h-5 w-5 text-green-400" />
    },
    {
      title: "Webhooks & Integrations",
      description: "Connect with 100+ services via native integrations or custom webhooks",
      icon: <GitBranch className="h-5 w-5 text-yellow-400" />
    }
  ];

  const toggleFeature = (index) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  const toggleUseCase = (index) => {
    setExpandedUseCase(expandedUseCase === index ? null : index);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white min-h-screen overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center py-24 px-4 md:px-12 relative"
      >
        <motion.div 
          variants={itemVariants}
          className="relative z-10 max-w-6xl mx-auto"
        >
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 120,
              duration: 0.8
            }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
          >
            RiMX Feature Overview
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-300"
          >
            Powerful tools designed to streamline operations, enhance collaboration, and drive business growth.
          </motion.p>
          <Link to="/">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Animated Background Elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.2, 
            scale: 1.2,
            rotate: 360 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 blur-3xl -z-10"
        />
      </motion.section>

      {/* Core Features */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Core Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to organize, track, and optimize your team's work in one intuitive platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-slate-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-600 transition-all"
              >
                <div className="text-blue-500 mb-4">
                  {feature.icon}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-400 mb-4">{feature.description}</p>
                  </div>
                  <button 
                    onClick={() => toggleFeature(index)}
                    className="text-gray-400 hover:text-white"
                  >
                    {expandedFeature === index ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
                
                <AnimatePresence>
                  {expandedFeature === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-2 mb-6">
                        {feature.highlights.map((highlight, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start space-x-2"
                          >
                            <Check className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                            <span>{highlight}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden">
                        <iframe
                          src={feature.videoDemo}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`${feature.title} Demo`}
                        ></iframe>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 px-4 md:px-12 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Technical Capabilities
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The robust infrastructure powering RiMX's performance and reliability
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Performance Highlights
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  </div>
                  <div>
                    <p className="font-medium text-white">Sub-100ms API response times</p>
                    <p className="text-sm text-gray-400">99th percentile performance across all endpoints</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                  </div>
                  <div>
                    <p className="font-medium text-white">Horizontal scalability</p>
                    <p className="text-sm text-gray-400">Designed to handle millions of concurrent users</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  </div>
                  <div>
                    <p className="font-medium text-white">Real-time updates</p>
                    <p className="text-sm text-gray-400">WebSocket-based synchronization across all clients</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-400" />
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {technicalFeatures.map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-gray-900/30 p-4 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {feature.icon}
                      <h4 className="font-medium text-white">{feature.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Industry Solutions
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              How different industries leverage RiMX to solve their unique challenges
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all"
              >
                <div className="text-3xl mb-4">{useCase.icon}</div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-white mb-4">{useCase.industry}</h3>
                  <button 
                    onClick={() => toggleUseCase(index)}
                    className="text-gray-400 hover:text-white"
                  >
                    {expandedUseCase === index ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {useCase.features.map((feature, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <div className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5">✓</div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <AnimatePresence>
                  {expandedUseCase === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-300 text-sm"
                    >
                      {useCase.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-16 px-4 md:px-12 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Integration Ecosystem
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              RiMX connects seamlessly with the tools you already use
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {[
              { name: "Slack", logo: "🟢" },
              { name: "Microsoft Teams", logo: "🔵" },
              { name: "Salesforce", logo: "🔷" },
              { name: "Jira", logo: "🟦" },
              { name: "GitHub", logo: "⬛" },
              { name: "AWS", logo: "🟧" },
              { name: "Google Workspace", logo: "🟥" },
              { name: "Zoom", logo: "🟦" },
              { name: "Okta", logo: "🟩" },
              { name: "Tableau", logo: "🟫" },
              { name: "Zapier", logo: "🟪" },
              { name: "HubSpot", logo: "🟧" }
            ].map((partner, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900/30 rounded-lg p-4 flex flex-col items-center justify-center border border-gray-700 hover:border-blue-500/30 transition-all"
              >
                <div className="text-2xl mb-2">{partner.logo}</div>
                <p className="text-gray-300 text-sm text-center">{partner.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 md:px-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-12 text-center border border-blue-500/30"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            See how RiMX can be customized for your specific business needs.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/DemoPage">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-800 transition-all"
              >
                Watch Demo
              </motion.button>
            </Link>
            <Link to="/ContactPage">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-700 transition-all"
              >
                Contact Sales
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Features;