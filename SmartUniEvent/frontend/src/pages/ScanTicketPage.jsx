import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { Html5Qrcode } from 'html5-qrcode';

function ScanTicketPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [qrData, setQrData] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // Get available cameras
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        setCameras(devices);
        setSelectedCamera(devices[0].id);
      }
    }).catch(err => {
      console.error('Error getting cameras:', err);
    });

    return () => {
      stopCamera();
    };
  }, [isAdmin, navigate]);

  const startCamera = async () => {
    try {
      if (!selectedCamera) {
        setError('No camera selected');
        return;
      }

      // Reset processing flag and results when starting camera
      isProcessingRef.current = false;
      setResult(null);
      setError(null);

      // Clean up any existing scanner instance
      if (html5QrCodeRef.current) {
        try {
          const state = await html5QrCodeRef.current.getState();
          if (state === 2 || state === 3) { // 2 = SCANNING, 3 = PAUSED
            await html5QrCodeRef.current.stop();
          }
          html5QrCodeRef.current.clear();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
        html5QrCodeRef.current = null;
      }

      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      };

      await html5QrCode.start(
        selectedCamera,
        config,
        (decodedText, decodedResult) => {
          // QR code successfully scanned
          handleQrCodeScanned(decodedText);
        },
        (errorMessage) => {
          // Scanning error (ignore these as they happen continuously)
        }
      );

      setCameraActive(true);
      setError(null);
    } catch (err) {
      console.error('Error starting camera:', err);
      setError('Failed to start camera. Please check camera permissions.');
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        const state = await html5QrCodeRef.current.getState();
        if (state === 2) { // 2 = SCANNING state
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
        setCameraActive(false);
      } catch (err) {
        console.error('Error stopping camera:', err);
      }
    }
  };

  const handleQrCodeScanned = async (decodedText) => {
    // Prevent multiple scans
    if (isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    // Pause scanner immediately to prevent continuous scanning
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.pause();
      } catch (e) {
        console.log('Pause error:', e);
      }
    }

    // Validate the scanned ticket
    try {
      setScanning(true);
      setError(null);
      setResult(null);

      const response = await adminAPI.scanTicket(decodedText);

      setResult({
        valid: response.data.valid,
        message: response.data.message,
        ticket: response.data.ticket,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to validate ticket');
      setResult(null);
    } finally {
      setScanning(false);
      // Stop camera after validation completes
      await stopCamera();
      // Reset processing flag
      isProcessingRef.current = false;
    }
  };

  const handleManualScan = async (e) => {
    e.preventDefault();

    if (!qrData.trim()) {
      setError('Please enter QR code data');
      return;
    }

    try {
      setScanning(true);
      setError(null);
      setResult(null);

      const response = await adminAPI.scanTicket(qrData);

      setResult({
        valid: response.data.valid,
        message: response.data.message,
        ticket: response.data.ticket,
      });

      setQrData('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to validate ticket');
      setResult(null);
    } finally {
      setScanning(false);
    }
  };

  const handleReset = () => {
    setQrData('');
    setResult(null);
    setError(null);
    if (cameraActive) {
      stopCamera();
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="display-4 text-warning mb-2">
              <i className="bi bi-qr-code-scan me-3"></i>
              Scan Tickets
            </h1>
            <p className="text-light">Validate event tickets by scanning QR codes</p>
          </div>

          <div className="row">
            {/* Camera Scanner */}
            <div className="col-lg-6 mb-4">
              <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-header text-warning" style={{backgroundColor: '#2a2a2a', borderBottom: '2px solid var(--accent-color)'}}>
                  <h5 className="mb-0">
                    <i className="bi bi-camera me-2"></i>
                    Camera Scanner
                  </h5>
                </div>
                <div className="card-body p-4">
                  {/* Camera Selection */}
                  {cameras.length > 0 && !cameraActive && (
                    <div className="mb-3">
                      <label className="form-label text-light">Select Camera</label>
                      <select
                        className="form-select"
                        value={selectedCamera}
                        onChange={(e) => setSelectedCamera(e.target.value)}
                      >
                        {cameras.map((camera) => (
                          <option key={camera.id} value={camera.id}>
                            {camera.label || `Camera ${camera.id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* QR Reader - Camera Preview */}
                  {!cameraActive && (
                    <div
                      className="mb-3 text-center p-5 rounded"
                      style={{
                        backgroundColor: '#2a2a2a',
                        border: '2px dashed var(--accent-color)',
                        minHeight: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div>
                        <i className="bi bi-camera-video text-warning mb-3" style={{fontSize: '4rem'}}></i>
                        <p className="text-light mb-0">Camera preview will appear here</p>
                      </div>
                    </div>
                  )}

                  <div
                    id="qr-reader"
                    ref={scannerRef}
                    className="mb-3"
                    style={{
                      width: '100%'
                    }}
                  ></div>

                  {/* Camera Controls */}
                  {!cameraActive ? (
                    <button
                      onClick={startCamera}
                      className="btn btn-warning btn-lg w-100"
                      disabled={cameras.length === 0 || scanning}
                    >
                      <i className="bi bi-camera-video me-2"></i>
                      Start Camera
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="btn btn-danger btn-lg w-100"
                    >
                      <i className="bi bi-camera-video-off me-2"></i>
                      Stop Camera
                    </button>
                  )}

                  {cameras.length === 0 && (
                    <div className="alert alert-warning mt-3">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      No cameras found. Please connect a camera or use manual entry.
                    </div>
                  )}

                  {scanning && (
                    <div className="text-center mt-3">
                      <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Validating...</span>
                      </div>
                      <p className="text-light mt-2">Validating ticket...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Manual Entry */}
            <div className="col-lg-6 mb-4">
              <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
                <div className="card-header text-warning" style={{backgroundColor: '#2a2a2a', borderBottom: '2px solid var(--accent-color)'}}>
                  <h5 className="mb-0">
                    <i className="bi bi-keyboard me-2"></i>
                    Manual Entry
                  </h5>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleManualScan}>
                    <div className="mb-3">
                      <label htmlFor="qrData" className="form-label text-light">
                        Enter QR Code Data
                      </label>
                      <textarea
                        id="qrData"
                        className="form-control"
                        rows="6"
                        value={qrData}
                        onChange={(e) => setQrData(e.target.value)}
                        placeholder="Paste the QR code data here..."
                        disabled={scanning}
                      ></textarea>
                      <small className="text-muted">
                        Paste the JSON data from the QR code
                      </small>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-warning btn-lg flex-grow-1"
                        disabled={scanning || !qrData.trim()}
                      >
                        {scanning ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Validating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Validate
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-warning btn-lg"
                        onClick={handleReset}
                        disabled={scanning}
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger mb-4" data-aos="fade-in">
              <div className="d-flex align-items-center">
                <i className="bi bi-x-circle-fill me-3" style={{fontSize: '2rem'}}></i>
                <div>
                  <h5 className="mb-1">Validation Failed</h5>
                  <p className="mb-0">{error}</p>
                </div>
              </div>
              <div className="text-center mt-3">
                <button
                  onClick={() => {
                    setResult(null);
                    setError(null);
                    startCamera();
                  }}
                  className="btn btn-warning"
                >
                  <i className="bi bi-qr-code-scan me-2"></i>
                  Scan Next Ticket
                </button>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && result.valid && (
            <div className="alert alert-success mb-4" data-aos="fade-in">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-check-circle-fill me-3 text-success" style={{fontSize: '3rem'}}></i>
                <div>
                  <h4 className="mb-1">✓ Ticket Valid!</h4>
                  <p className="mb-0">{result.message}</p>
                </div>
              </div>

              {result.ticket && (
                <div className="card bg-light mt-3">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Ticket Details</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <small className="text-muted d-block">Ticket Number</small>
                        <strong>{result.ticket.ticketNumber}</strong>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block">Event</small>
                        <strong>{result.ticket.eventName}</strong>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block">Holder Name</small>
                        <strong>{result.ticket.holderName}</strong>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block">Email</small>
                        <strong>{result.ticket.holderEmail}</strong>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block">Event Date</small>
                        <strong>{new Date(result.ticket.eventDate).toLocaleDateString()}</strong>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block">Event Time</small>
                        <strong>{result.ticket.eventTime}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-3">
                <button
                  onClick={() => {
                    setResult(null);
                    setError(null);
                    startCamera();
                  }}
                  className="btn btn-warning btn-lg"
                >
                  <i className="bi bi-qr-code-scan me-2"></i>
                  Scan Next Ticket
                </button>
              </div>
            </div>
          )}

          {/* Invalid Ticket Result */}
          {result && !result.valid && (
            <div className="alert alert-warning mb-4" data-aos="fade-in">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-3" style={{fontSize: '2rem'}}></i>
                <div>
                  <h5 className="mb-1">✗ Ticket Invalid</h5>
                  <p className="mb-0">{result.message}</p>
                </div>
              </div>
              <div className="text-center mt-3">
                <button
                  onClick={() => {
                    setResult(null);
                    setError(null);
                    startCamera();
                  }}
                  className="btn btn-warning"
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="card border-0" style={{backgroundColor: 'var(--surface-color)'}}>
            <div className="card-body p-4">
              <h5 className="text-warning mb-3">
                <i className="bi bi-info-circle me-2"></i>
                How to Use
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-warning">Camera Scanning:</h6>
                  <ol className="text-light">
                    <li className="mb-2">Click "Start Camera"</li>
                    <li className="mb-2">Allow camera permissions when prompted</li>
                    <li className="mb-2">Point camera at the QR code</li>
                    <li>Wait for automatic detection and validation</li>
                  </ol>
                </div>
                <div className="col-md-6">
                  <h6 className="text-warning">Manual Entry:</h6>
                  <ol className="text-light">
                    <li className="mb-2">Use a QR scanner device</li>
                    <li className="mb-2">Copy the scanned QR data</li>
                    <li className="mb-2">Paste into the text area</li>
                    <li>Click "Validate Ticket"</li>
                  </ol>
                </div>
              </div>
              <div className="alert alert-warning mt-3 mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <strong>Important:</strong> Each ticket can only be used once. Already scanned tickets will be rejected.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanTicketPage;
