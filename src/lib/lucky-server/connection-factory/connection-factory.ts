/**
 * @remarks
 * Regarding the {@link ensureConnected} method, best practice is to invoke it at the constructor
 * stage of the Service/Repository that utilizes this connection.
 *
 * If the client isn't connected, {@link ensureConnected} should throw an error.
 */
export interface ConnectionFactory {
  connect(): void;
  disconnect(): void;
  getClient(): any;
  ensureConnected(): void;
}
