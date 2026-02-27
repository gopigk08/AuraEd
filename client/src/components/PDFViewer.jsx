import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, ZoomIn, ZoomOut, Download, AlertCircle } from 'lucide-react';
import axios from 'axios';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const getGoogleDriveId = (url) => {
    if (!url) return null;
    // Handle /d/VIDEO_ID format
    const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) return match1[1];
    // Handle id=VIDEO_ID format
    const match2 = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match2) return match2[1];
    return null;
};

const PDFViewer = ({ pdfUrl }) => {
    const [numPages, setNumPages] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [blobUrl, setBlobUrl] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [containerWidth, setContainerWidth] = useState(null);
    const containerRef = useRef(null);

    const driveId = getGoogleDriveId(pdfUrl);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries[0]) {
                setContainerWidth(entries[0].contentRect.width);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    const isExternalPublic = pdfUrl?.startsWith('http')
        && !pdfUrl.includes('localhost')
        && !pdfUrl.includes('127.0.0.1')
        && (!window.location.hostname || !pdfUrl.includes(window.location.hostname));

    useEffect(() => {
        const fetchPdf = async () => {
            // Let iframe handle Drive links or External Public Links
            if (!pdfUrl || driveId || isExternalPublic) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setProgress(0);

            // Construct absolute URL for local files
            const urlToFetch = pdfUrl.startsWith('http')
                ? pdfUrl
                : `http://${window.location.hostname}:5000${pdfUrl}`;

            // Fix slashes
            const finalUrl = urlToFetch.replace(/\\/g, '/');
            console.log("Fetching PDF from local server:", finalUrl);

            try {
                const response = await axios.get(finalUrl, {
                    responseType: 'blob',
                    onDownloadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 5000000));
                        setProgress(percentCompleted);
                    },
                });

                // Check if the content type is actually PDF (basic check)
                if (response.data.type !== 'application/pdf') {
                    console.warn("Fetched content is not a PDF:", response.data.type);
                }

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const objectUrl = URL.createObjectURL(blob);
                setBlobUrl(objectUrl);
                setLoading(false);
            } catch (err) {
                console.error("PDF Fetch Error:", err);
                setError(finalUrl);
                setLoading(false);
            }
        };

        fetchPdf();

        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [pdfUrl, driveId]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function onDocumentLoadError(error) {
        console.error("Error loading document:", error);
    }

    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.6));

    // Render Google Drive Embed
    if (driveId) {
        return (
            <div style={{ width: '100%', height: '800px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'right', backgroundColor: '#f9f9f9' }}>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', borderColor: 'var(--primary)', fontWeight: 600 }}>
                        <Download size={16} /> Open/Download in Drive
                    </a>
                </div>
                <iframe
                    src={`https://drive.google.com/file/d/${driveId}/preview`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', flex: 1 }}
                    title="Google Drive PDF Viewer"
                    allow="autoplay"
                ></iframe>
                {/* Overlay to block Pop-out button */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', zIndex: 20, backgroundColor: 'transparent' }}></div>
            </div>
        );
    }

    // Render Google Docs Viewer for External Links
    if (isExternalPublic) {
        return (
            <div style={{ width: '100%', height: '800px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'right', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', borderColor: 'var(--primary)', fontWeight: 600 }}>
                        <Download size={16} /> Open Natively / Download
                    </a>
                </div>
                {/* Google Docs Viewer embedded */}
                <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', flex: 1 }}
                    title="External PDF Viewer"
                ></iframe>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
                <AlertCircle size={48} style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Failed to load PDF</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>The document could not be downloaded.</p>
                <a
                    href={error}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Download size={18} /> Download Directly
                </a>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'relative' }}>

            {/* Toolbar */}
            {!loading && blobUrl && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 1rem',
                    borderBottom: '1px solid var(--border)',
                    backgroundColor: '#fff',
                    position: 'sticky',
                    top: 'var(--topbar-height, 70px)',
                    zIndex: 10,
                    flexWrap: 'wrap',
                    gap: '10px'
                }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button onClick={zoomOut} className="btn btn-outline" style={{ padding: '0.4rem', color: '#000' }} title="Zoom Out">
                            <ZoomOut size={18} />
                        </button>
                        <span style={{ fontSize: '0.9rem', width: '40px', textAlign: 'center', color: '#000' }}>{Math.round(scale * 100)}%</span>
                        <button onClick={zoomIn} className="btn btn-outline" style={{ padding: '0.4rem', color: '#000' }} title="Zoom In">
                            <ZoomIn size={18} />
                        </button>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {numPages ? `${numPages} Pages` : ''}
                    </span>
                    <a
                        href={blobUrl}
                        download="lecture_note.pdf"
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', color: '#000', display: 'flex', alignItems: 'center', gap: '5px', borderColor: '#ccc' }}
                    >
                        <Download size={16} /> Download
                    </a>
                    <a
                        href={blobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        View
                    </a>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div style={{
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff'
                }}>
                    <Loader2 className="animate-spin" size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                    <div style={{ width: '200px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.2s ease' }} />
                    </div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Downloading Document... {progress}%
                    </p>
                </div>
            )}

            {/* PDF Content (Scrollable) */}
            {blobUrl && (
                <div
                    ref={containerRef}
                    style={{
                        backgroundColor: '#e5e7eb', // Grey background like standard viewers
                        padding: '2rem 1rem',
                        display: loading ? 'none' : 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        overflow: 'auto', // Allow both axis scrolling
                        maxHeight: '100%',
                        flex: 1
                    }}>
                    <Document
                        file={blobUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                        error={<div>
                            <p style={{ color: 'red' }}>Error rendering PDF.</p>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>If this is a Drive link, make sure it's public.</p>
                        </div>}
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <div key={`page_${index + 1}`} style={{ marginBottom: '1rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', flexShrink: 0, margin: '0 auto' }}>
                                <Page
                                    pageNumber={index + 1}
                                    scale={scale}
                                    width={containerWidth ? Math.min(containerWidth - 40, window.innerWidth > 768 ? 1000 : containerWidth - 20) * scale : undefined}
                                />
                            </div>
                        ))}
                    </Document>
                </div>
            )}
        </div>
    );
};

export default PDFViewer;
