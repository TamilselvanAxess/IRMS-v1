import React from 'react';
import Alert from './Alert';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert type="error">
          <strong>Something went wrong:</strong> {this.state.error?.message || 'Unknown error.'}
        </Alert>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 