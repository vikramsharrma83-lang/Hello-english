import React, { ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear potentially corrupted storage keys
    try {
      sessionStorage.clear();
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#060a14] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            HELLO ENGLISH
          </h1>
          <p className="text-sm text-slate-400 max-w-xs mb-6">
            Something went wrong while loading this screen. Tap below to reload the app smoothly.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-sky-500/20 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload App (पुनः लोड करें)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
