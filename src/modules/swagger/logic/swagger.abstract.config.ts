/**
 * Configs should extend this class.
 * This class is used to create Swagger API documentation.
 * It can be extended to add more configurations or methods as needed.
 */
export abstract class SwaggerConfig {
  name = '';
  docs: Record<string, any> = {};

  constructor(name: string) {
    this.name = name;
    this.docs = {};
  }
}
