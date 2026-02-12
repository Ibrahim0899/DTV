import { useState, useEffect, useRef } from 'react';

/**
 * ConnectionStatus — Displays a floating connection indicator
 * Shows green (connected), orange (reconnecting), red (disconnected)
 * Also shows a banner when reconnecting or disconnected
 */
export default function ConnectionStatus({ socket }) {
    const [status, setStatus] = useState('connecting'); // 'connected' | 'connecting' | 'reconnecting' | 'disconnected'
    const [latency, setLatency] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const pingInterval = useRef(null);

    useEffect(() => {
        if (!socket) return;

        const onConnect = () => {
            setStatus('connected');
            setShowBanner(false);
            setReconnectAttempt(0);
        };

        const onDisconnect = () => {
            setStatus('disconnected');
            setShowBanner(true);
            setLatency(null);
        };

        const onReconnectAttempt = (attempt) => {
            setStatus('reconnecting');
            setShowBanner(true);
            setReconnectAttempt(attempt);
        };

        const onReconnectFailed = () => {
            setStatus('disconnected');
            setShowBanner(true);
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.io.on('reconnect_attempt', onReconnectAttempt);
        socket.io.on('reconnect_failed', onReconnectFailed);

        // Set initial status
        if (socket.connected) {
            setStatus('connected');
        }

        // Ping for latency measurement every 5s
        pingInterval.current = setInterval(() => {
            if (socket.connected) {
                const start = Date.now();
                socket.volatile.emit('ping-check', () => {
                    setLatency(Date.now() - start);
                });
            }
        }, 5000);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.io.off('reconnect_attempt', onReconnectAttempt);
            socket.io.off('reconnect_failed', onReconnectFailed);
            if (pingInterval.current) clearInterval(pingInterval.current);
        };
    }, [socket]);

    const statusConfig = {
        connected: { color: 'bg-emerald-500', pulse: false, label: 'Connecté' },
        connecting: { color: 'bg-amber-500', pulse: true, label: 'Connexion...' },
        reconnecting: { color: 'bg-amber-500', pulse: true, label: `Reconnexion... (${reconnectAttempt})` },
        disconnected: { color: 'bg-red-500', pulse: false, label: 'Déconnecté' },
    };

    const config = statusConfig[status];

    return (
        <>
            {/* Floating dot indicator */}
            <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 glass-card px-3 py-1.5 rounded-full">
                <div className="relative">
                    <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                    {config.pulse && (
                        <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${config.color} animate-ping`} />
                    )}
                </div>
                <span className="text-[10px] text-white/60 font-medium">
                    {status === 'connected' && latency !== null
                        ? `${latency}ms`
                        : config.label
                    }
                </span>
            </div>

            {/* Reconnection banner */}
            {showBanner && (
                <div className={`fixed top-14 left-0 right-0 z-50 text-center py-2 px-4 text-sm font-medium transition-all duration-300 ${status === 'disconnected'
                        ? 'bg-red-500/90 text-white'
                        : 'bg-amber-500/90 text-black'
                    }`}>
                    {status === 'reconnecting' && (
                        <>
                            <span className="inline-block animate-spin mr-2">⟳</span>
                            Reconnexion en cours... (tentative {reconnectAttempt})
                        </>
                    )}
                    {status === 'disconnected' && (
                        <>
                            ⚠ Connexion perdue — vérifiez votre réseau
                            <button
                                onClick={() => socket?.connect()}
                                className="ml-3 px-3 py-0.5 bg-white/20 rounded text-xs hover:bg-white/30 transition-colors"
                            >
                                Réessayer
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
