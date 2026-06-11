import { faker } from '@faker-js/faker';
export class CommentBuilder {
  withComment() {
    this.comment = faker.lorem.sentences(2);
    return this;
  }

  build() {
    return {
      comment: this.comment,
    };
  }
}
