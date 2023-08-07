export class Example {
  id: string | undefined;
  name: string;
  description: string;
  created: Date;
  updated: Date | undefined;
  deleted: Date | undefined;

  constructor(nameParams: string, descriptionParams: string) {
    this.name = nameParams;
    this.description = descriptionParams;
    this.created = new Date();
  }
}
