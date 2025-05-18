// Commenting out the code below because the typeorm-seeding package isn't working. I will fix it in the future.

// import { define } from "typeorm-seeding";
// import { faker } from '@faker-js/faker';
// import { User } from "../entities/user.entity";
// import { EUserRole } from "src/shared/enums/EUserRole.enum";

// define(User, () => {
//   const user = new User();
//   user.firstName = faker.person.firstName();
//   user.lastName = faker.person.lastName();
//   user.email = 'admin@mail.com';
//   user.password = '$2b$10$bohyWR00d8RxR6qc09TqhulB8H8OePirnZZb5tqS7MoYbBxJa.qce';
//   user.isActive = true;
//   user.role = EUserRole.COMPANY_SUPER_ADMIN;
//   return user;
// });