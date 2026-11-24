import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertCircle, RefreshCw, Home, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('VAYGO ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleResetAndReload = () => {
    try {
      localStorage.removeItem('vaygo_session');
    } catch {}
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 textured-surface">
          <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/15 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-5 text-white">
              <AlertCircle size={28} />
            </div>

            <h1 className="text-xl font-black text-white tracking-tight mb-2">
              Something went wrong
            </h1>
            <p className="text-[#A1A1AA] text-xs leading-relaxed mb-6">
              The application encountered an unexpected issue while rendering. You can try refreshing the page or returning to the home screen.
            </p>

            {this.state.error && (
              <div className="glass-pill px-3 py-2 rounded-xl text-left text-[11px] text-neutral-400 mb-6 font-mono break-all max-h-24 overflow-y-auto border border-white/10">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full h-11 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <RefreshCw size={14} /> Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full h-11 glass-card hover:bg-white/10 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
              >
                <Home size={14} /> Go to Dashboard
              </button>

              <button
                type="button"
                onClick={this.handleResetAndReload}
                className="text-[11px] text-[#A1A1AA] hover:text-white mt-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={12} /> Reset session and return to login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
