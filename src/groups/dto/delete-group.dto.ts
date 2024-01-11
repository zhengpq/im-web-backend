import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteGroupDto {
  @IsNotEmpty()
  @IsString()
  group_id: string;
}
