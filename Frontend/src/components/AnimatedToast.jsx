import { Toaster } from 'react-hot-toast'

export default function AnimatedToast() {
  return (
    <Toaster
      position="bottom-center"
      gutter={12}
      containerClassName="!bottom-6"
      toastOptions={{
        duration: 3500,
        style: {
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(10px)',
          color: '#111827',
          padding: '14px 20px',
          borderRadius: '14px',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
          fontSize: '14px',
          fontWeight: 500,
          maxWidth: '420px',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
          style: {
            background: 'rgba(254,242,242,0.98)',
            color: '#991b1b',
            border: '1px solid rgba(239,68,68,0.2)',
          },
        },
      }}
    />
  )
}