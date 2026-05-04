import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 shadow-card text-center space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">
              Algo deu errado
            </h2>
            <p className="text-sm text-muted-foreground">
              Ocorreu um erro inesperado ao renderizar esta tela. Você pode tentar
              novamente ou recarregar a página.
            </p>
            {this.state.error?.message && (
              <pre className="text-xs text-left bg-muted p-3 rounded-lg overflow-auto max-h-32 text-muted-foreground">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-2 justify-center">
              <Button onClick={this.handleReset} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" /> Tentar novamente
              </Button>
              <Button onClick={() => window.location.reload()}>
                Recarregar
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
