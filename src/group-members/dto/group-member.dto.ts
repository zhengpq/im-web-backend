import { IsNotEmpty, IsString } from 'class-validator';

export class GetMemberDto {
  @IsNotEmpty()
  @IsString()
  group_id: string;

  @IsNotEmpty()
  @IsString()
  user_id: string;
}
