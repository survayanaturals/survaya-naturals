import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, MessageCircle, Clock, ArrowUpRight } from 'lucide-react'
import toast from 'react-hot-toast'

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'hello@survayanaturals.com'
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919959248167'
const WHATSAPP_DISPLAY = import.meta.env.VITE_WHATSAPP_DISPLAY || '+91 99592 48167'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [isFocused, setIsFocused] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    const body = `Hi Survaya Naturals Team,\n\nMy name is ${form.name}.\n\n${form.message}\n\n— ${form.name} (${form.email})`
    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink, '_blank')
    toast.success('Opening your mail client...', { position: 'top-center' })
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const contactMethods = [
    {
      Icon: MessageCircle,
      title: 'WhatsApp Chat',
      value: WHATSAPP_DISPLAY,
      link: `https://wa.me/${WHATSAPP_NUMBER}`,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50',
      border: 'border-green-100 dark:border-green-900/50',
      hover: 'hover:border-green-400',
      description: 'Quickest response for orders'
    },
    {
      Icon: Mail,
      title: 'Email Address',
      value: CONTACT_EMAIL,
      link: `mailto:${CONTACT_EMAIL}`,
      color: 'text-blue-600',
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      hover: 'hover:border-blue-200',
      description: 'For business & formal inquiries'
    },
    {
      Icon: MapPin,
      title: 'Our Location',
      value: 'Rajahmundry, AndhraPradesh, India',
      link: '#',
      color: 'text-red-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100 dark:border-amber-900/50',
      hover: 'hover:border-amber-600',
      description: 'Main operating hub'
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream-100 min-h-screen py-16 md:py-24 font-sans"
    >
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-amber-800 font-semibold text-xs tracking-widest uppercase mb-3 bg-amber-100/50 px-3 py-1 rounded-full inline-block"
          >
            Get in Touch
          </motion.p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-amber-950 mb-4">
            Let's Start a Conversation
          </h1>
          <p className="text-amber-900/70 text-lg">
            Have a question or looking to place an order? Drop us a message and our team will get back to you shortly.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {contactMethods.map(({ Icon, title, value, link, color, bg, border, hover, description }) => (
              <motion.a
                whileHover={{ y: -2 }}
                key={title}
                href={link}
                target={link.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`flex items-center justify-between p-5 rounded-2xl bg-white border ${border} ${hover} shadow-sm transition-all group`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}>
                    <Icon className={color} size={22} />
                  </div>
                  <div>
                    <p className="font-medium text-amber-800/50 text-xs uppercase tracking-wider">{title}</p>
                    <p className="text-amber-950 font-semibold text-base mt-0.5">{value}</p>
                    <p className="text-amber-900/60 text-xs mt-0.5">{description}</p>
                  </div>
                </div>
                <ArrowUpRight className="text-amber-200 group-hover:text-amber-600 transition-colors w-5 h-5 flex-shrink-0" />
              </motion.a>
            ))}

            {/* Business Hours Card */}
            <div className="bg-[#e4c79a] border border-[#976c2c] text-amber-950 rounded-2xl p-6 relative overflow-hidden mt-2">
              <div className="absolute right-[-20px] bottom-[-20px] text-[#f1e6d5]/40 pointer-events-none">
                <Clock size={140} />
              </div>

              <div className="flex items-center gap-2 mb-4 relative z-10">
                <Clock className="text-amber-700/50 w-5 h-5" />
                <h3 className="font-semibold text-base text-amber-950">Order Hours</h3>
              </div>

              <div className="flex flex-col gap-3 text-sm relative z-10">
                <div className="flex justify-between items-center border-b border-[#f1e6d5] pb-2">
                  <span className="text-amber-900/70">Monday – Saturday</span>
                  <span className="font-semibold text-amber-900 bg-[#f4ebd9] px-2.5 py-0.5 rounded-md text-xs">9:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-amber-900/70">Sunday</span>
                  <span className="font-semibold text-amber-900 bg-[#f4ebd9] px-2.5 py-0.5 rounded-md text-xs">10:00 AM – 4:00 PM</span>
                </div>
                <div className="pt-3 border-t border-[#f1e6d5] text-amber-900/50 text-xs font-bold italic">
                  * Orders placed after hours will be prioritized and confirmed the following morning.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-amber-950/5 border border-amber-100/50 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-serif font-bold text-amber-950">Send us a Message</h2>
              <p className="text-amber-900/60 text-sm mt-1">Fill out the form below and we'll get back to you by email.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key} className="relative">
                    <label className={`block text-xs font-bold uppercase mb-2 transition-colors ${isFocused === key ? 'text-amber-700' : 'text-amber-900/60'}`}>
                      {label}
                    </label>
                    <input
                      type={type}
                      value={form[key]}
                      onFocus={() => setIsFocused(key)}
                      onBlur={() => setIsFocused('')}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      required
                      className="w-full border border-amber-200/60 focus:border-amber-600 rounded-xl px-4 py-3 text-amber-950 text-sm focus:outline-none transition-all focus:ring-4 focus:ring-amber-100/50 placeholder:text-amber-900/30"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-2 transition-colors ${isFocused === 'subject' ? 'text-amber-700' : 'text-amber-900/60'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onFocus={() => setIsFocused('subject')}
                  onBlur={() => setIsFocused('')}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="How can we help you?"
                  required
                  className="w-full border border-amber-200/60 focus:border-amber-600 rounded-xl px-4 py-3 text-amber-950 text-sm focus:outline-none transition-all focus:ring-4 focus:ring-amber-100/50 placeholder:text-amber-900/30"
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-2 transition-colors ${isFocused === 'message' ? 'text-amber-700' : 'text-amber-900/60'}`}>
                  Message
                </label>
                <textarea
                  value={form.message}
                  onFocus={() => setIsFocused('message')}
                  onBlur={() => setIsFocused('')}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  required
                  className="w-full border border-amber-200/60 focus:border-amber-600 rounded-xl px-4 py-3 text-amber-950 text-sm focus:outline-none transition-all focus:ring-4 focus:ring-amber-100/50 resize-none placeholder:text-amber-900/30"
                />
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full bg-olive-700 text-white font-medium py-3.5 rounded-xl transition-all shadow-md shadow-amber-900/10 flex items-center justify-center gap-2 mt-2 group"
              >
                <span>Send Message</span>
                <Mail size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>
            </form>
          </div>

        </div>
      </div>
    </motion.div>
  )
}