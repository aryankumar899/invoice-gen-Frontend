import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PresentationControls, Environment, ContactShadows, RoundedBox, Html } from '@react-three/drei';
import { Box, Typography } from '@mui/material';

function FloatingDashboard() {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(t / 4) / 4;
    meshRef.current.rotation.z = Math.sin(t / 4) / 8;
  });

  return (
    <Float rotationIntensity={0.5} floatIntensity={2} speed={2}>
      <group ref={meshRef} scale={1.4}>
        <RoundedBox args={[3.26, 2.04, 0.1]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#030712" roughness={0.1} metalness={0.8} />
          
          {/* Dashboard UI Overlay mapped proportionately via distanceFactor */}
          <Html position={[0, 0, 0.051]} transform distanceFactor={1.2} zIndexRange={[100, 0]}>
            <Box
              sx={{
                width: 800,
                height: 500,
                background: 'rgba(17, 24, 39, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                p: { xs: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                boxShadow: 'inset 0 0 40px rgba(99, 102, 241, 0.2)'
              }}
            >
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem', mb: 1 }}>Total Revenue</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', fontSize: '3rem' }}>$42,500.00</Typography>
                </Box>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)' }} />
              </Box>

              {/* Chart Mock */}
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 150, mt: 2 }}>
                {[40, 60, 30, 80, 50, 100, 70].map((h, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      flex: 1, 
                      height: `${h}%`, 
                      background: i === 5 ? 'linear-gradient(180deg, #6366f1 0%, rgba(99,102,241,0.2) 100%)' : 'rgba(99,102,241,0.1)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.3s ease',
                      border: i === 5 ? '1px solid rgba(99,102,241,0.5)' : 'none',
                      borderBottom: 'none'
                    }} 
                  />
                ))}
              </Box>

              {/* Recent Invoices Mock */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Recent Invoices</Typography>
                {[1, 2].map(i => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, background: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: i === 1 ? '#10b981' : '#f59e0b', opacity: 0.8 }} />
                      <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, fontSize: '1.2rem' }}>{i === 1 ? 'Stripe Corp' : 'Linear Inc.'}</Typography>
                    </Box>
                    <Box sx={{ px: 2, py: 0.5, borderRadius: 10, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Paid</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Html>
        </RoundedBox>

        {/* Decorative elements behind the dashboard */}
        <mesh position={[-1.6, -1.2, -0.2]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#ec4899" roughness={0.2} />
        </mesh>
        <mesh position={[1.6, 1.2, -0.3]}>
          <torusGeometry args={[0.25, 0.05, 16, 32]} />
          <meshStandardMaterial color="#6366f1" roughness={0.1} metalness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

export default function ThreeDCard() {
  return (
    <Box sx={{ width: '100%', height: { xs: 300, md: 500 }, position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#6366f1" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ec4899" />
        
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0.1, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <FloatingDashboard />
        </PresentationControls>
        
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4} color="#6366f1" />
      </Canvas>
    </Box>
  );
}
