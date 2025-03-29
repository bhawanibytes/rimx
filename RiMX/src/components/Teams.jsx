import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Shield, 
  Globe, 
  Code, 
  Server, 
  Layers, 
  Award, 
  Mail, 
  Clock, 
  Zap,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowLeft
} from 'lucide-react';

const Teams = () => {
  const [expandedMember, setExpandedMember] = useState(null);
  const [expandedAdvisor, setExpandedAdvisor] = useState(null);

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "Former tech executive with 15+ years in enterprise software",
      expertise: ["Strategy", "Leadership", "Product Vision"],
      background: "Alex founded RiMX after seeing firsthand how disorganized workflows were crippling productivity at Fortune 500 companies. His vision was to create a platform that brings clarity to complexity.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "Cloud infrastructure specialist and security expert",
      expertise: ["Architecture", "DevOps", "Security"],
      background: "Sarah leads our engineering team with a focus on building scalable, secure systems. Previously, she architected cloud solutions for major financial institutions.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Marcus Ruiz",
      role: "Head of Product",
      bio: "Product leader with UX design background",
      expertise: ["UX Research", "Roadmapping", "Analytics"],
      background: "Marcus bridges the gap between technical and business needs, ensuring RiMX solves real problems with elegant solutions. He's passionate about data-driven product development.",
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      name: "Priya Patel",
      role: "Engineering Lead",
      bio: "Full-stack developer with focus on scalability",
      expertise: ["React", "Node.js", "Database Design"],
      background: "Priya oversees the core application development, focusing on performance and maintainability. She's contributed to several open source projects in the productivity space.",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  const advisors = [
    {
      name: "Dr. Emily Zhang",
      role: "AI Advisor",
      affiliation: "Stanford University",
      focus: "Machine Learning Applications",
      bio: "Dr. Zhang advises our AI strategy, bringing cutting-edge research in natural language processing and predictive analytics to RiMX's intelligent features."
    },
    {
      name: "James Wilson",
      role: "Enterprise Advisor",
      affiliation: "Former CIO, Fortune 500",
      focus: "Digital Transformation",
      bio: "With decades of enterprise experience, James helps shape RiMX's large-scale deployment capabilities and governance features."
    }
  ];

  const toggleMember = (index) => {
    setExpandedMember(expandedMember === index ? null : index);
  };

  const toggleAdvisor = (index) => {
    setExpandedAdvisor(expandedAdvisor === index ? null : index);
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
            Meet the RiMX Team
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-300"
          >
            A diverse team of innovators, builders, and problem solvers dedicated to transforming how businesses operate.
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

      {/* Core Values */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4 md:px-12 bg-gray-800/50"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The principles that guide everything we build at RiMX
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500/30 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-900/20 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-white">Security First</h3>
              </div>
              <p className="text-gray-300">
                We build with privacy and security as foundational principles, not afterthoughts.
                All features are designed with enterprise-grade protection from the ground up.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-900/20 rounded-lg">
                  <Globe className="h-6 w-6 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-white">Global Impact</h3>
              </div>
              <p className="text-gray-300">
                Our solutions are designed to empower teams across industries and borders.
                We support multiple languages, timezones, and regional compliance standards.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-700 hover:border-green-500/30 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-900/20 rounded-lg">
                  <Code className="h-6 w-6 text-green-300" />
                </div>
                <h3 className="text-xl font-semibold text-white">Technical Excellence</h3>
              </div>
              <p className="text-gray-300">
                We obsess over performance, reliability, and elegant engineering.
                Every line of code is written with scalability and maintainability in mind.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Leadership Team */}
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
              Leadership Team
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The visionaries and builders driving RiMX forward
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all group"
              >
                <div className="h-48 bg-gradient-to-r from-blue-900/30 to-purple-900/30 flex items-center justify-center relative">
                  <motion.img 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    src={member.image} 
                    alt={member.name} 
                    className="h-32 w-32 rounded-full object-cover border-4 border-gray-800 group-hover:border-blue-500/50 transition-all"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-blue-300 mb-3">{member.role}</p>
                    </div>
                    <button 
                      onClick={() => toggleMember(index)}
                      className="text-gray-400 hover:text-white"
                    >
                      {expandedMember === index ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                  
                  <AnimatePresence>
                    {expandedMember === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-400 text-sm mb-4">{member.background}</p>
                        <div className="border-t border-gray-700 pt-4">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Expertise</h4>
                          <div className="flex flex-wrap gap-2">
                            {member.expertise.map((skill, i) => (
                              <motion.span 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-xs bg-gray-900/50 text-blue-200 px-2 py-1 rounded"
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
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
              Advisory Board
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Industry experts guiding our strategic direction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advisors.map((advisor, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-900/20 rounded-lg flex-shrink-0">
                    <Award className="h-6 w-6 text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{advisor.name}</h3>
                        <p className="text-purple-300 text-sm mb-2">{advisor.role}</p>
                      </div>
                      <button 
                        onClick={() => toggleAdvisor(index)}
                        className="text-gray-400 hover:text-white"
                      >
                        {expandedAdvisor === index ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-1">
                      <span className="font-medium">Affiliation:</span> {advisor.affiliation}
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      <span className="font-medium">Focus:</span> {advisor.focus}
                    </p>
                    
                    <AnimatePresence>
                      {expandedAdvisor === index && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-gray-300 text-sm"
                        >
                          {advisor.bio}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Principles */}
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
              Our Engineering Principles
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The standards that shape our technical decisions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Server className="h-5 w-5 text-blue-400" />,
                title: "99.99% Uptime",
                description: "Enterprise-grade reliability with multi-region failover and 24/7 monitoring"
              },
              {
                icon: <Layers className="h-5 w-5 text-purple-400" />,
                title: "Modular Architecture",
                description: "Plug-and-play components that adapt to your evolving needs"
              },
              {
                icon: <Zap className="h-5 w-5 text-yellow-400" />,
                title: "Performance Optimized",
                description: "Benchmarked to handle 10,000+ requests per second per instance"
              },
              {
                icon: <Clock className="h-5 w-5 text-green-400" />,
                title: "Rapid Iteration",
                description: "Continuous delivery with weekly feature updates and monthly major releases"
              }
            ].map((principle, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 p-6 rounded-xl border border-gray-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  {principle.icon}
                  <h3 className="font-semibold text-white">{principle.title}</h3>
                </div>
                <p className="text-gray-300 text-sm">{principle.description}</p>
              </motion.div>
            ))}
          </div>
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
            Join Our Team
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            We're always looking for exceptional talent to join our growing team.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/careers">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-800 transition-all"
              >
                View Open Positions
              </motion.button>
            </Link>
            <Link to="/ContactPage">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-700 transition-all"
              >
                Contact Talent Team
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Teams;