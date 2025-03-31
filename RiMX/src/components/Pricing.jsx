import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Check, 
  X, 
  Zap, 
  Shield, 
  Globe, 
  Server, 
  Users, 
  Mail, 
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Star
} from 'lucide-react';

const Pricing = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activePlan, setActivePlan] = useState(1);

  const plans = [
    {
      name: "Starter",
      monthlyPrice: "$9.99",
      annualPrice: "$24",
      period: "per user/month",
      description: "Perfect for small teams getting started",
      cta: "Start Free Trial",
      features: [
        "Up to 10 users",
        "Basic workflow automation",
        "Standard analytics",
        "Email support",
        "Community forum access"
      ],
      limitations: [
        "No API access",
        "Limited integrations",
        "No custom branding"
      ],
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-500/30"
    },
    {
      name: "Professional",
      monthlyPrice: "$29.99",
      annualPrice: "$79",
      period: "per user/month",
      description: "For growing teams needing more power",
      cta: "Get Started",
      features: [
        "Up to 50 users",
        "Advanced workflow automation",
        "Comprehensive analytics",
        "Priority email support",
        "API access",
        "Custom integrations",
        "Basic SSO"
      ],
      limitations: [
        "Limited custom roles"
      ],
      color: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-500/30",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For organizations with complex needs",
      cta: "Contact Sales",
      features: [
        "Unlimited users",
        "Premium workflow automation",
        "Advanced analytics + AI",
        "24/7 phone support",
        "Dedicated CSM",
        "Single Sign-On (SSO)",
        "Custom branding",
        "On-premise options",
        "SLA Guarantee"
      ],
      limitations: [],
      color: "from-gray-800/50 to-gray-900/50",
      borderColor: "border-gray-700"
    }
  ];

  const addOns = [
    {
      name: "Additional Users",
      description: "Add more users to your plan",
      price: "$5/user/month"
    },
    {
      name: "Enhanced Security",
      description: "Advanced security features and compliance",
      price: "$50/month"
    },
    {
      name: "Priority Support",
      description: "24/7 support with 1-hour response time",
      price: "$200/month"
    },
    {
      name: "Custom Development",
      description: "Tailored features and integrations",
      price: "Custom"
    }
  ];

  const testimonials = [
    {
      name: "TechStart Inc.",
      quote: "Switching to RiMX saved us over $15,000 annually compared to our previous stack.",
      role: "50-person SaaS company"
    },
    {
      name: "Global Consulting",
      quote: "The Professional plan gave us everything we needed to coordinate across 12 offices.",
      role: "Enterprise consulting firm"
    },
    {
      name: "Creative Agency",
      quote: "We outgrew the Starter plan in 6 months - the upgrade process was seamless.",
      role: "Digital agency"
    }
  ];

  const faqs = [
    {
      question: "Can I change plans later?",
      answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes will be prorated based on your billing cycle."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, all plans include a 14-day free trial with full access to all features. No credit card required."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can be invoiced."
    },
    {
      question: "How is billing handled?",
      answer: "Plans are billed monthly or annually in advance. You'll receive an invoice via email for each billing period."
    },
    {
      question: "Do you offer discounts for non-profits?",
      answer: "Yes, we offer special pricing for registered non-profit organizations. Contact our sales team for details."
    },
    {
      question: "What's your uptime SLA?",
      answer: "We guarantee 99.9% uptime for all paid plans. Enterprise plans can negotiate higher SLAs."
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
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
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-300"
          >
            Choose the plan that fits your needs. All plans include a 14-day free trial with no credit card required.
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

      {/* Toggle for Annual/Monthly */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex justify-center mb-12"
      >
        <div className="bg-gray-800 rounded-lg p-1 inline-flex">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md font-medium ${billingCycle === 'monthly' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            Monthly Billing
          </button>
          <button 
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-md font-medium ${billingCycle === 'annual' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            Annual Billing (Save 20%)
          </button>
        </div>
      </motion.div>

      {/* Pricing Plans */}
      <section className="py-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {plans.map((plan, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={`
                  relative p-8 rounded-2xl border
                  ${plan.popular 
                    ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/50 shadow-xl shadow-blue-500/20' 
                    : 'bg-slate-800 border-gray-700'}
                  transition-all
                `}
                onClick={() => setActivePlan(index)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  {plan.name === "Enterprise" ? plan.price : 
                   billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice}
                </div>
                <div className="text-gray-400 mb-6">
                  {plan.period} {billingCycle === 'annual' && plan.name !== "Enterprise" && '(billed annually)'}
                </div>
                <p className="text-gray-300 mb-8">{plan.description}</p>
                <Link to={plan.name === "Enterprise" ? "/ContactPage" : "/signup"}>
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`
                      w-full py-3 rounded-lg font-medium
                      ${plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gray-700 hover:bg-gray-600'}
                      transition-colors
                    `}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
                
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white mb-4">What's included</h4>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <motion.li 
                        key={`feature-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="text-lg font-semibold text-white mb-4">Limitations</h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, i) => (
                          <motion.li 
                            key={`limitation-${i}`}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-2"
                          >
                            <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                            <span className="text-gray-400">{limitation}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
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

      {/* Testimonials */}
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
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real teams getting real value from RiMX
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-slate-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 text-yellow-400 fill-yellow-400" 
                    />
                  ))}
                </div>
                <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <h4 className="font-bold text-blue-400">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
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
              Add-Ons & Extensions
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Enhance your plan with these powerful options
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addOn, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-900/30 p-6 rounded-xl border border-gray-700 hover:border-blue-500/30 transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{addOn.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{addOn.description}</p>
                <p className="text-blue-300 font-medium">{addOn.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16 px-4 md:px-12 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:flex items-center gap-12"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="md:w-1/2 mb-8 md:mb-0"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Enterprise Solutions
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                For large organizations with complex requirements, we offer customized enterprise packages with premium features and support.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">Dedicated security review</h3>
                    <p className="text-gray-400">Compliance and penetration testing tailored to your requirements</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="h-6 w-6 text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">Global deployment options</h3>
                    <p className="text-gray-400">Choose from our worldwide regions or bring your own cloud</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Server className="h-6 w-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-white">Private cloud or on-premise</h3>
                    <p className="text-gray-400">Full control over your deployment environment</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Request Enterprise Demo</h3>
                <p className="text-gray-300 mb-8">
                  Our enterprise team will work with you to design a solution tailored to your organization's specific needs.
                </p>
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
                    <label htmlFor="company" className="block text-sm font-medium mb-2">Company</label>
                    <input 
                      type="text" 
                      id="company" 
                      placeholder="Your Company" 
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
                  <Link to="/ContactPage/confirmation">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-4 rounded-lg font-medium transition-all"
                    >
                      Contact Enterprise Team
                    </motion.button>
                  </Link>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 md:px-12 bg-gray-800/30">
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
              Everything you need to know about RiMX pricing.
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

      {/* Final CTA */}
      <section className="py-24 px-4 md:px-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-12 text-center border border-blue-500/30"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Ready to Get Started?
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
    </div>
  );
};

export default Pricing;