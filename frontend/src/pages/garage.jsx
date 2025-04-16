import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import "../styles/garage.css";

// Component to load and display the 3D model
function CarModel({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.5} />;
}

function GaragePage() {
  const [modelUrl, setModelUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching a 3D model URL from an API
  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await fetch('https://api.example.com/3d-models/car');
        const data = await response.json();
        setModelUrl(data.url); // Assuming the API returns a GLTF/GLB file URL
      } catch (error) {
        console.error('Error fetching 3D model:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, []);

  if (loading) {
    return (
      <div className="garage-container">
        <h2>Vehicle Section</h2>
        <p>Loading 3D car model...</p>
      </div>
    );
  }

  if (!modelUrl) {
    return (
      <div className="garage-container">
        <h2>Vehicle Section</h2>
        <p>Failed to load 3D car model. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="garage-container">
      <h2>Vehicle Section</h2>
      <p>Select and interact with your vehicle's 3D model below:</p>

      {/* 3D Model Viewer */}
      <div className="model-viewer">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <CarModel url={modelUrl} />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Canvas>
      </div>
    </div>
  );
}

export default GaragePage;