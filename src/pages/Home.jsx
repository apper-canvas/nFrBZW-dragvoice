import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [showTutorial, setShowTutorial] = useState(false)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Create Professional Invoices with Drag & Drop
        </h1>
        <p className="text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
          Easily design custom invoices by dragging and dropping headers, footers, and images. 
          No design skills required!
        </p>
        
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => setShowTutorial(!showTutorial)}
            className="btn btn-outline flex items-center gap-2"
          >
            {showTutorial ? 'Hide Tutorial' : 'Show Tutorial'}
          </button>
        </div>
      </motion.div>
      
      {showTutorial && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 card p-6"
        >
          <h2 className="text-xl font-semibold mb-4">How to Use DragVoice</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>Select elements from the left sidebar and drag them onto your invoice</li>
            <li>Position headers, footers, and images exactly where you want them</li>
            <li>Fill in your invoice details in the form fields</li>
            <li>Preview your invoice in real-time</li>
            <li>Export as PDF or send directly to your clients</li>
          </ol>
        </motion.div>
      )}
      
      <MainFeature />
    </div>
  )
}

export default Home