'use client';
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { HighlightText } from '@/components/animate-ui/text/highlight';

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (session) router.push('/influencer')
  }, [session, router, status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isRegister) {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const err = await res.json()
        return setError(err.message || 'Registration failed')
      }
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/influencer')
    }
  }

  return (
    <div className="flex flex-col  items-center justify-items-center min-h-screen p-12 pb-15 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] font-[size:var(--font-geist-sans-size)]">
      <div className='flex flex-col items-center justify-center gap-4 mt-20'>
        <h1 className="text-6xl font-bold">FUI</h1>
        <HighlightText text="The platform that helps you find the right influencer for your brand." className='text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center' />
      </div>
      <div className="flex flex-col items-center justify-center gap-6 p-8 sm:p-20 bg-white text-black rounded-md">
        <h1 className="text-3xl font-bold">{isRegister ? 'Register' : 'Login'} to FUI</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
          {error && <div className="text-red-500">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            className="border px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border px-4 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="border px-4 py-2 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <button
            type="submit"
            className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="text-sm">
          {isRegister ? 'Already have an account?' : 'New here?'}{' '}
          <button
            className="text-blue-600 underline cursor-pointer"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => signIn('github')}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faGithub} />
            Continue with GitHub
          </button>
          <button
            onClick={() => signIn('google')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faGoogle} />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
