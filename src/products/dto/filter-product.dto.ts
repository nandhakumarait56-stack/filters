import { IsOptional, IsString, IsBooleanString } from 'class-validator';

export class FilterProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsBooleanString()
  stockAvailable?: string; // "true" | "false"
}
