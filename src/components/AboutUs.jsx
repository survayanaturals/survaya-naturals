import { motion } from 'framer-motion'
import { Home, Leaf, ShieldAlert, Truck, Sparkles } from 'lucide-react';
import About_US from "../components/Banner/About_US.png";

export default function AboutUs() {

  const features = [
    { icon: <Home className="w-5 h-5 text-amber-700" />, label: 'Homemade Recipes' },
    { icon: <Leaf className="w-5 h-5 text-emerald-700" />, label: 'Natural Ingredients' },
    { icon: <ShieldAlert className="w-5 h-5 text-red-600" />, label: 'Zero Maida' },
    { icon: <Truck className="w-5 h-5 text-amber-700" />, label: 'Pan India Delivery' },
  ];

  return (
    <section id="about" className="py-16 bg-[#fcf8f2]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Images Grid Cell */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Image Layer */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-warm-lg">
              <motion.img
                src={About_US}
                alt="Baking at Survaya Naturals"
                className="w-full h-100 object-cover"
                loading="lazy"
                initial={{
                  opacity: 0,
                  scale: 1.1
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8
                }}
              />
            </div>

            {/* Fixed Floating Badge Layout Container */}
            <div className="absolute -bottom-12 -right-5 z-20 bg-[#f4e5d9] border border-[#eb6421] text-amber-950 rounded-2xl p-4 shadow-warm-lg flex items-center gap-3">
              <div className="bg-amber-900/10 p-2.5 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <div className="font-serif font-bold text-xl text-amber-950 leading-none">3+ Years</div>
                <div className="text-xs font-medium text-amber-800/80 mt-1 tracking-wide">Of Baking Love</div>
              </div>
            </div>

            {/* Decorative Background Accent */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#f1e6d5] rounded-2xl -z-0 rotate-6" />
          </motion.div>

          {/* Content Grid Cell */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-5"
          >
            <div>
              <span className="inline-block text-amber-800 font-semibold text-xs tracking-widest uppercase bg-amber-900/5 px-3 py-1 rounded-full mb-3">
                Our Story
              </span>
              <h2 className="section-heading text-3xl md:text-4xl leading-tight text-amber-950">
                Naturally Nourished,Handcrafted with Care<br />
                <span className="italic font-playfair text-amber-900">The Story of Survaya Naturals</span>
              </h2>
            </div>

            <p className="text-amber-900/90 font-lato leading-relaxed">
              My name is Sandhya Siva Parvathi. While managing a demanding corporate career, a severe health crisis forced me to pause. Seeking healing, I remembered my childhood in Rajahmundry, Andhra Pradesh—an era of vibrant health built on traditional foods like Ragi (Solu), Badam, and Coconut. Realizing that modern convenience foods trade away this natural strength for heavy processing and preservatives, I quit my job to reclaim my well-being and revive ancestral food wisdom. That is how Survaya Naturals was born.
            </p>
            <p className="text-amber-900/90 font-lato leading-relaxed">
              We believe food should nourish your body and delight your taste buds without compromise. Our kitchen uses only 100% whole, natural ingredients, ensuring zero maida, zero artificial flavors, and zero preservatives. Every biscuit, cake, and chocolate is handcrafted fresh in small batches using generational recipes. From our signature Ragi Badam Biscuits to custom Birthday Cakes, each product is a labor of love made to bring traditional health back to your family’s table.
            </p>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
              {features.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-[#fcf8f2] border border-[#f1e6d5] rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="p-2 rounded-lg bg-white shadow-xs flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-amber-950 font-medium text-sm sm:text-base">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}