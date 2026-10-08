import { useState, FormEvent } from 'react'
import { MotionSection } from '@/components/ui/MotionSection'
import { motion, AnimatePresence } from 'framer-motion'
import { typograph } from '@/lib/typograph'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error')
      return
    }
    setStatus('success')
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <MotionSection id="contact">
      <div className="container mx-auto max-w-2xl px-4">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Связаться
        </h2>
        <p className="mt-4 text-center text-neutral-300">
          {typograph('Оставь сообщение, и я отвечу в ближайшее время.')}
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8"
        >
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Имя
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 placeholder-neutral-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Иван Иванов"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 placeholder-neutral-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="ivan@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Сообщение
            </label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 placeholder-neutral-500 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Расскажи о проекте..."
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-transform hover:scale-[1.02] hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-neutral-950 active:scale-[0.98]"
          >
            <Send size={18} />
            Отправить
          </button>
          <AnimatePresence mode="wait">
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium ${
                  status === 'success'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {status === 'success' ? (
                  <>
                    <CheckCircle size={16} />
                    Сообщение отправлено!
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    Заполните все поля
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </MotionSection>
  )
}

export default Contact
