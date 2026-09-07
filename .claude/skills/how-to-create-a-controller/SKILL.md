---
name: how-to-create-a-controller
description: How to create a controller in this project. Use when asked to add, create, or scaffold a controller.
---

# Create a controller

1. Create a controller file at `src/modules/[module-name]/controllers/[controller-name].controller.ts`.
2. Inside `[controller-name].controller.ts` create and export a class based controller named `ControllerNameController`, which implements the `ControllerFactory` interface.
3. The controller's constructor should always accepts `private readonly app: Application` as its first argument.
4. Implement the `registerRoutes(): void` method — this is where all route handlers for this controller are defined. It must appear first in the class body, above all other methods.
5. Create an adjacent file called `index.ts` which would export the controller class from the controller file.
6. The controller can only be instantiated by its own domain module class (a file named `[module-name].module.ts`).
7. Request validation DTOs live in a `dto/` folder next to the controller. Name the file `[verb]-[resource].dto.ts` (kebab-case, no `Schema` in the filename) and export a camelCase Joi object named `[verb][Resource]Schema` (e.g. `create-user.dto.ts` → `createUserSchema`). Include the source in the name only when it is not the request body (e.g. `get-books-query.dto.ts` → `getBooksQuerySchema`).
