import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Layers, 
  CreditCard, 
  Users, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Phone,
  HelpCircle,
  Check,
  BarChart2,
  Shield,
  Globe,
  Code,
  Zap,
  Clock,
  Calendar,
  MessageSquare,
  Settings,
  PieChart,
  Lock,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Testimonial Data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechInnovate",
    quote: "RiMX transformed our team's productivity within weeks. The intuitive interface and powerful analytics gave us visibility we never had before. It's like having a digital assistant for organization.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Operations Director, GlobalSolutions",
    quote: "After evaluating 12 different platforms, RiMX stood out for its seamless workflow integration. Our implementation was smooth and we saw ROI in just two months. The most intuitive management system I've ever used.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Startup Founder",
    quote: "What impressed me most was how RiMX scales with our business. We started with just 5 team members and now have 85. The platform grew with us, adding features exactly when we needed them.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4
  },
  {
    name: "David Wilson",
    role: "CTO, EnterpriseCorp",
    quote: "The custom integration capabilities saved us hundreds of development hours. RiMX plays nicely with all our existing systems while providing the structure we desperately needed.",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    rating: 5
  }
];

// Pricing Plans
const pricingPlans = [
  {
    name: "Starter",
    price: "$9.99",
    period: "per user/month",
    features: [
      "Up to 5 Team Members",
      "Basic Project Management",
      "Limited Analytics",
      "Email Support",
      "100GB Storage"
    ],
    recommended: false
  },
  {
    name: "Professional",
    price: "$29.99",
    period: "per user/month",
    features: [
      "Unlimited Team Members",
      "Advanced Project Tools",
      "Comprehensive Analytics",
      "Priority Support",
      "1TB Storage",
      "Custom Workflows",
      "API Access"
    ],
    recommended: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored solution",
    features: [
      "Unlimited Everything",
      "Dedicated Account Manager",
      "Custom Integrations",
      "On-premise Options",
      "SLA Guarantee",
      "Training & Onboarding",
      "24/7 Premium Support"
    ],
    recommended: false
  }
];

// Features
const features = [
  {
    icon: <Layers size={40} />,
    title: "Project Management",
    description: "End-to-end project tracking with customizable workflows, Gantt charts, and milestone tracking",
    highlights: [
      "Drag-and-drop task management",
      "Automated progress tracking",
      "Resource allocation tools"
    ]
  },
  {
    icon: <Users size={40} />,
    title: "Team Collaboration",
    description: "Real-time communication and file sharing designed for distributed teams",
    highlights: [
      "Integrated chat and comments",
      "@mentions and notifications",
      "Role-based permissions"
    ]
  },
  {
    icon: <BarChart2 size={40} />,
    title: "Advanced Analytics",
    description: "Actionable insights with customizable dashboards and reports",
    highlights: [
      "Real-time performance metrics",
      "Forecasting tools",
      "Exportable reports"
    ]
  },
  {
    icon: <Settings size={40} />,
    title: "Custom Workflows",
    description: "Tailor the platform to match your exact business processes",
    highlights: [
      "Visual workflow builder",
      "Automation rules",
      "Approval processes"
    ]
  },
  {
    icon: <Globe size={40} />,
    title: "Global Accessibility",
    description: "Cloud-based access from anywhere with offline capabilities",
    highlights: [
      "Multi-language support",
      "Region-specific compliance",
      "99.9% uptime SLA"
    ]
  },
  {
    icon: <Lock size={40} />,
    title: "Enterprise Security",
    description: "Military-grade protection for your sensitive data",
    highlights: [
      "SOC 2 Type II certified",
      "End-to-end encryption",
      "GDPR compliant"
    ]
  }
];

// Stats
const stats = [
  { value: "85%", label: "Increase in team productivity" },
  { value: "10x", label: "Faster project completion" },
  { value: "200+", label: "Integrations available" },
  { value: "24/7", label: "Customer support" }
];

// FAQ
const faqs = [
  {
    question: "How long does implementation take?",
    answer: "Most teams are up and running within 48 hours. Our average onboarding time is 1.2 days for small teams and 3-5 days for enterprise deployments with complex integrations."
  },
  {
    question: "Can I import data from other tools?",
    answer: "Yes! RiMX supports CSV imports for all major data types and has pre-built importers for popular tools like Asana, Trello, Jira, and Monday.com. Our support team can assist with large or complex migrations."
  },
  {
    question: "Is there a mobile app?",
    answer: "Absolutely. RiMX offers full-featured iOS and Android apps with offline capabilities. All your data syncs automatically when you reconnect."
  },
  {
    question: "How does pricing work for large teams?",
    answer: "We offer volume discounts starting at 50 seats. Enterprise plans include unlimited users with pricing based on your organization's size and needs. Contact our sales team for a custom quote."
  },
  {
    question: "What security certifications do you have?",
    answer: "RiMX is SOC 2 Type II certified, GDPR compliant, and meets all major industry security standards. We undergo regular third-party audits and penetration testing."
  }
];

const RiMXLandingPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activePricingPlan, setActivePricingPlan] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => 
      (prev + 1) % testimonials.length
    );
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Container Variants
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

  // Item Variants
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
            The Future of Work is Organized
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-300"
          >
            RiMX is the intelligent work management platform that helps teams align, collaborate, and deliver exceptional results.
          </motion.p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/signup">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
                className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-800 transition-all"
              >
                Start Free Trial
              </motion.button>
            </Link>
            <Link to="/Demopage">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 120 }}
                className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-700 transition-all"
              >
                Watch Demo
              </motion.button>
            </Link>
          </div>
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

      {/* Trusted By Section */}
      <section className="py-12 px-4 md:px-12 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400 text-center mb-8">TRUSTED BY INNOVATIVE TEAMS WORLDWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
            {['Microsoft', 'Airbnb', 'Spotify', 'Netflix', 'Salesforce', 'Uber'].map((company, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-xl font-bold"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 md:px-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="text-center p-6 bg-gray-800/50 rounded-xl"
            >
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-2"
              >
                {stat.value}
              </motion.div>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to organize, track, and optimize your team's work in one intuitive platform.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="bg-slate-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-600 transition-all"
              >
                <div className="text-blue-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 md:px-12 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Trusted by Thousands of Teams
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our customers say about RiMX.
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30 
                }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-slate-800 p-8 md:p-12 rounded-2xl relative">
                  <div className="absolute -top-6 -left-6 hidden md:block">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
                      <path d="M3 21C3 14.3726 8.37258 9 15 9C16.6569 9 18 7.65685 18 6C18 4.34315 16.6569 3 15 3C13.3431 3 12 4.34315 12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <motion.img 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20 
                      }}
                      src={testimonials[activeTestimonial].avatar} 
                      alt={testimonials[activeTestimonial].name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/30"
                    />
                    
                    <div className="text-center md:text-left">
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl italic mb-6"
                      >
                        "{testimonials[activeTestimonial].quote}"
                      </motion.p>
                      
                      <div>
                        <motion.h4 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-xl font-bold text-blue-400"
                        >
                          {testimonials[activeTestimonial].name}
                        </motion.h4>
                        <motion.p 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-gray-400 mb-2"
                        >
                          {testimonials[activeTestimonial].role}
                        </motion.p>
                        <div className="flex justify-center md:justify-start items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-5 h-5 ${i < testimonials[activeTestimonial].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevTestimonial}
                className="text-white bg-gray-800 p-3 rounded-full"
              >
                <ChevronLeft />
              </motion.button>
              <div className="flex items-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${activeTestimonial === index ? 'bg-blue-500' : 'bg-gray-600'}`}
                  />
                ))}
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTestimonial}
                className="text-white bg-gray-800 p-3 rounded-full"
              >
                <ChevronRight />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose the plan that fits your needs. Start for free, upgrade anytime.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={`
                  relative p-8 rounded-2xl border
                  ${plan.recommended 
                    ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/50 shadow-xl shadow-blue-500/20' 
                    : 'bg-slate-800 border-gray-700'}
                  transition-all
                `}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  {plan.price}
                </div>
                <div className="text-gray-400 mb-6">{plan.period}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.recommended ? 'text-blue-400' : 'text-green-500'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to={plan.name === "Enterprise" ? "/ContactPage" : "/signup"}>
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`
                      w-full py-3 rounded-lg font-medium
                      ${plan.recommended 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gray-700 hover:bg-gray-600'}
                      transition-colors
                    `}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-gray-400"
          >
            Need something different? <Link to="/ContactPage" className="text-blue-400 hover:underline">Contact us</Link> for custom solutions.
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 md:px-12 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to know about RiMX. Can't find the answer? <Link to="/contact" className="text-blue-400 hover:underline">Contact us</Link>.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-slate-800 rounded-xl overflow-hidden border border-gray-700"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="text-blue-500" />
                  ) : (
                    <ChevronDown className="text-blue-500" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-gray-400"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
            Join thousands of teams who are already working smarter with RiMX.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/signup">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-800 transition-all"
              >
                Start Free Trial
              </motion.button>
            </Link>
            <Link to="/DemoPage">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-700 transition-all"
              >
                Schedule Demo
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 md:px-12 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Have questions or want to learn more? Our team is ready to help.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="bg-gray-800 rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-12"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-gray-400 mb-8">
                Whether you're interested in our platform, need support, or want to discuss partnership opportunities, we'd love to hear from you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Email Us</h4>
                    <p className="text-gray-400">support@rimx.com</p>
                    <p className="text-gray-400">sales@rimx.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/10 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Call Us</h4>
                    <p className="text-gray-400">+1 (888) 746-9398</p>
                    <p className="text-gray-400">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/10 p-3 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Support Center</h4>
                    <p className="text-gray-400">24/7 customer support</p>
                    <Link to="/support" className="text-blue-400 hover:underline">Visit Help Center</Link>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="John Doe" 
                    className="w-full p-4 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="you@company.com" 
                    className="w-full p-4 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                  <select 
                    id="subject" 
                    className="w-full p-4 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select a topic</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    placeholder="How can we help you?" 
                    className="w-full p-4 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  ></textarea>
                </div>
                
                <Link to="/contact/confirmation">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 p-4 rounded-lg font-medium transition-all"
                  >
                    Send Message
                  </motion.button>
                </Link>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RiMXLandingPage;