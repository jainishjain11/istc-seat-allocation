export default function SplashScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundImage: 'url("/images/istc1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Darker Overlay for better contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10, 23, 55, 0.65)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          width: '100%',
          paddingBottom: '8vh',
          paddingLeft: '2vw',
          paddingRight: '2vw',
        }}
      >
        <h1
          style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            color: '#f3f4f6',
            textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 2px 8px #1e293b',
            letterSpacing: '0.04em',
            marginBottom: '0.5rem',
          }}
        >
          INDO Swiss Training Centre
        </h1>
        <h2
          style={{
            fontSize: '2rem',
            color: '#fbbf24',
            fontWeight: 700,
            marginBottom: '0.5rem',
            textShadow: '0 4px 24px rgba(0,0,0,0.9)',
            letterSpacing: '0.03em',
          }}
        >
          Seat Allocation System
        </h2>
        <div
          style={{
            color: '#e0e7ef',
            fontSize: '1.35rem',
            fontWeight: 500,
            marginBottom: '1.2rem',
            textShadow: '0 4px 24px rgba(0,0,0,0.9)',
            letterSpacing: '0.02em',
          }}
        >
          Official Portal for Diploma Courses Allotment
        </div>
        <div
          style={{
            color: '#38bdf8',
            fontWeight: 600,
            fontSize: '1.15rem',
            marginBottom: '2.5rem',
            textShadow: '0 4px 24px rgba(0,0,0,0.85)',
            letterSpacing: '0.03em',
          }}
        >
          A Government of India Institute
        </div>
        <div
          style={{
            color: '#fff',
            fontSize: '1.3rem',
            fontWeight: 500,
            textShadow: '0 4px 24px rgba(0,0,0,0.7)',
            opacity: 0.97,
            marginTop: '2rem',
            letterSpacing: '0.04em',
          }}
        >
          Loading...
        </div>
      </div>
    </div>
  );
}
