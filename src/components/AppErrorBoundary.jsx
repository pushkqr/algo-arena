import { Component } from "react";
import { ErrorState } from "./AsyncState";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleReload = this.handleReload.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  handleReload() {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="Application error"
          message="The app hit an unrecoverable state. Reload to continue."
          actionLabel="Reload App"
          onAction={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
