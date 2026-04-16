import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function TicketScanner() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [manualEntry, setManualEntry] = useState('');
  const [recentScans, setRecentScans] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // Initialize AOS animations
    if (window.AOS) {
      window.AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }, [isAdmin]);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setScanning(false);
    }
  };

  const validateTicket = async (qrData) => {
    try {
      // TODO: Replace with actual API call
      // const response = await adminAPI.scanTicket(qrData);

      // Mock validation
      const result = {
        valid: Math.random() > 0.3,
        ticketId: 'TKT-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        eventName: 'Spring Gala 2024',
        holderName: 'John Doe',
        timestamp: new Date().toISOString(),
      };

      setScanResult(result);
      setRecentScans([result, ...recentScans.slice(0, 9)]);

      // Play sound based on result
      const audio = new Audio(result.valid ? '/assets/sounds/success.mp3' : '/assets/sounds/error.mp3');
      audio.play().catch(() => {}); // Ignore errors if sound files don't exist

      return result;
    } catch (error) {
      console.error('Error validating ticket:', error);
      setScanResult({
        valid: false,
        error: 'Validation failed. Please try again.',
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleManualEntry = async (e) => {
    e.preventDefault();
    if (manualEntry.trim()) {
      await validateTicket(manualEntry);
      setManualEntry('');
    }
  };

  const getStatusBadge = (result) => {
    if (result.valid) {
      return <span className="badge bg-success">Valid</span>;
    }
    return <span className="badge bg-danger">Invalid</span>;
  };

  return (
    <main className="main">
      <section className="section" style={{minHeight: '100vh', paddingTop: '100px'}}>
        <div className="container">
          <div className="row mb-4" data-aos="fade-up">
            <div className="col-12">
              <h2 className="text-warning mb-2">Ticket Scanner</h2>
              <p className="text-light">Scan or manually enter ticket QR codes</p>
            </div>
          </div>

          <div className="row g-4">
            {/* Scanner Section */}
            <div className="col-lg-6">
              <div className="card border-0 h-100" style={{backgroundColor: 'var(--surface-color)'}} data-aos="fade-up" data-aos-delay="100">
                <div className="card-body p-4">
                  <h5 className="text-warning mb-4">
                    <i className="bi bi-qr-code-scan me-2"></i>QR Code Scanner
                  </h5>

                  {!scanning ? (
                    <div className="text-center py-5">
                      <i className="bi bi-camera-fill text-warning mb-4" style={{fontSize: '5rem'}}></i>
                      <p className="text-light mb-4">Start scanning tickets using your camera</p>
                      <button onClick={startScanning} className="btn btn-warning btn-lg">
                        <i className="bi bi-camera me-2"></i>Start Camera
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="position-relative mb-3">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-100 rounded"
                          style={{maxHeight: '400px', objectFit: 'cover'}}
                        />
                        <div className="position-absolute top-50 start-50 translate-middle border border-warning border-3"
                             style={{width: '250px', height: '250px', pointerEvents: 'none'}}>
                        </div>
                      </div>
                      <button onClick={stopScanning} className="btn btn-danger w-100">
                        <i className="bi bi-stop-circle me-2"></i>Stop Camera
                      </button>
                    </div>
                  )}

                  {/* Manual Entry */}
                  <div className="mt-4 pt-4 border-top border-secondary">
                    <h6 className="text-warning mb-3">Manual Entry</h6>
                    <form onSubmit={handleManualEntry}>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter ticket code"
                          value={manualEntry}
                          onChange={(e) => setManualEntry(e.target.value)}
                          style={{
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #3a3a3a',
                            color: '#f8f8f8'
                          }}
                        />
                        <button type="submit" className="btn btn-warning">
                          <i className="bi bi-search"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="col-lg-6">
              <div className="card border-0 h-100" style={{backgroundColor: 'var(--surface-color)'}} data-aos="fade-up" data-aos-delay="200">
                <div className="card-body p-4">
                  <h5 className="text-warning mb-4">
                    <i className="bi bi-check-circle me-2"></i>Validation Result
                  </h5>

                  {scanResult ? (
                    <div className={`alert ${scanResult.valid ? 'alert-success' : 'alert-danger'} mb-4`}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">{scanResult.valid ? 'Valid Ticket' : 'Invalid Ticket'}</h4>
                        {getStatusBadge(scanResult)}
                      </div>
                      {scanResult.valid ? (
                        <div>
                          <p className="mb-2"><strong>Ticket ID:</strong> {scanResult.ticketId}</p>
                          <p className="mb-2"><strong>Event:</strong> {scanResult.eventName}</p>
                          <p className="mb-2"><strong>Holder:</strong> {scanResult.holderName}</p>
                          <p className="mb-0"><strong>Scanned:</strong> {new Date(scanResult.timestamp).toLocaleString()}</p>
                        </div>
                      ) : (
                        <p className="mb-0">{scanResult.error || 'This ticket is not valid or has already been used.'}</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-upc-scan text-muted mb-3" style={{fontSize: '4rem'}}></i>
                      <p className="text-light">Scan a ticket to see validation results</p>
                    </div>
                  )}

                  {/* Recent Scans */}
                  <div className="mt-4">
                    <h6 className="text-warning mb-3">Recent Scans</h6>
                    {recentScans.length === 0 ? (
                      <p className="text-light small">No recent scans</p>
                    ) : (
                      <div className="list-group">
                        {recentScans.map((scan, index) => (
                          <div
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                            style={{backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a'}}
                          >
                            <div>
                              <div className="text-light small">
                                {scan.ticketId || 'N/A'}
                              </div>
                              <div className="text-muted" style={{fontSize: '0.75rem'}}>
                                {new Date(scan.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                            {getStatusBadge(scan)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="row mt-4">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-body text-center p-4">
                  <h3 className="text-warning display-6">{recentScans.length}</h3>
                  <p className="text-light mb-0">Total Scans</p>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="400">
              <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-body text-center p-4">
                  <h3 className="text-success display-6">
                    {recentScans.filter(s => s.valid).length}
                  </h3>
                  <p className="text-light mb-0">Valid</p>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="500">
              <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-body text-center p-4">
                  <h3 className="text-danger display-6">
                    {recentScans.filter(s => !s.valid).length}
                  </h3>
                  <p className="text-light mb-0">Invalid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TicketScanner;
