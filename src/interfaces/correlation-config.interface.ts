export interface CorrelationConfig {
  header: string;
  generator: () => string;
}
