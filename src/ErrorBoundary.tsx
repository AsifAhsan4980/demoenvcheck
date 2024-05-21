import React, {JSX, ReactNode} from 'react';

interface State {
    hasError: boolean
}

interface Props {
    children : ReactNode
}

class ErrorBoundary extends React.Component<Props,State> {
    constructor(props: Props ) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error : any) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <p>Loading failed! Please reload.</p>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;