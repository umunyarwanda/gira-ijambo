// Commenting out the code below because the typeorm-seeding package isn't working. I will fix it in the future.

// import { Factory, Seeder } from "typeorm-seeding";
// import { Connection } from "typeorm";
// import { User } from "src/modules/users/entities/user.entity";

// export default class UserSeeder implements Seeder {
//   public async run(factory: Factory, connection: Connection): Promise<any> {
//     await factory(User)().createMany(1);
//   }
// }