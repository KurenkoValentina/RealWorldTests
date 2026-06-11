import { faker } from '@faker-js/faker';
export class ArticleBuilder {
  withTitle() {
    this.title = faker.lorem.words(5);
    return this;
  }
  withDesc() {
    this.desc = faker.lorem.sentences(2);
    return this;
  }

  withText() {
    this.text = faker.lorem.paragraphs(3);
    return this;
  }
  build() {
    return {
      title: this.title,
      desc: this.desc,
      text: this.text,
    };
  }
}
