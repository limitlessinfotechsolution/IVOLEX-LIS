import { useState } from 'react'
import Container from '../../../components/common/Container.jsx'
import { SEO } from '../../../components/SEO'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@ivolex.com',
      link: 'mailto:hello@ivolex.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '123 E-commerce St, Digital City, DC 12345',
      link: null,
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon-Fri: 9AM-6PM EST',
      link: null,
    },
  ]

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.success("Message sent successfully! We'll get back to you soon.")
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SEO
        title="Contact Us - IVOLEX"
        description="Get in touch with IVOLEX. We're here to help with any questions about our products or services."
        keywords="contact ivolex, customer support, help, questions"
      />
      <section className="py-10">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                Have a question, suggestion, or need assistance? We&apos;d love
                to hear from you. Our team is here to help make your shopping
                experience exceptional.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  {contactInfo.map(({ icon: Icon, title, value, link }) => (
                    <div key={title} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-brand-600" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{title}</h3>
                        {link ? (
                          <a
                            href={link}
                            className="text-stone-600 hover:text-brand-600 transition-colors"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-stone-600">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ Link */}
                <div className="mt-8 p-6 bg-stone-50 rounded-2xl">
                  <h3 className="font-semibold mb-2">Quick Help</h3>
                  <p className="text-stone-600 text-sm mb-4">
                    Looking for immediate answers? Check out our FAQ section for
                    common questions about orders, shipping, and returns.
                  </p>
                  <a href="/faq" className="btn btn-outline btn-sm">
                    View FAQ
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="card p-8">
                  <h2 className="text-2xl font-semibold mb-6">
                    Send us a Message
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="product">Product Question</option>
                      <option value="shipping">Shipping & Returns</option>
                      <option value="technical">Technical Issue</option>
                      <option value="partnership">
                        Partnership Opportunity
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      placeholder="Please provide details about your inquiry..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-sm text-stone-500 mt-4">
                    * Required fields. We typically respond within 24 hours
                    during business days.
                  </p>
                </form>
              </div>
            </div>

            {/* Additional Help */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-2xl">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-stone-600 text-sm">
                  For detailed inquiries and order support
                </p>
              </div>
              <div className="text-center p-6 border rounded-2xl">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone size={24} className="text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-stone-600 text-sm">
                  For urgent matters and immediate assistance
                </p>
              </div>
              <div className="text-center p-6 border rounded-2xl">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock size={24} className="text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-stone-600 text-sm">
                  Coming soon! Real-time chat support
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
