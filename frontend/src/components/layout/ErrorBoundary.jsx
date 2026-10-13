import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('HEXA NEWS Runtime Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6 font-['Inter',sans-serif]">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-gray-200 text-center">
            <div className="w-14 h-14 bg-red-50 text-[#ff4c60] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h2 className="font-['Prompt',sans-serif] text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              We encountered an unexpected rendering issue. You can refresh the page or return to the main homepage.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#ff4c60] hover:bg-[#e03b4e] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition shadow-sm cursor-pointer"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="px-5 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-semibold uppercase tracking-wider rounded-lg transition"
              >
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
