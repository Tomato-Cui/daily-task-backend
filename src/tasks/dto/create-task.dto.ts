export class CreateTaskDto {
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly deadline?: Date;
} 