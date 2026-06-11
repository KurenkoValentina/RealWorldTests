import { faker } from '@faker-js/faker';
export class UserBuilder {
  withEmail() {
    this.email = faker.internet.email({ lastName: 'BIN', provider: 'robot.dev' });
    return this;
  }
  withPassword(length = 10) {
    this.password = faker.internet.password({ length: length });
    return this;
  }

  withUsername(name) {
    this.username = name ?? faker.person.fullName();
    return this;
  }
  build() {
    return {
      email: this.email,
      password: this.password,
      username: this.username,
    };
  }
}
/* build() {
  const result = structuredClone(this);
  return result;
}*/
