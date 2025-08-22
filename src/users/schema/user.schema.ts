import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum Role{
    ADMIN ="Admin",
    USER ="User",
}

export type UserDocument = User & Document;

@Schema()
export class User{
    @Prop({required:true,})
    name:string;
    @Prop({ required: true, unique: true,})    
    email: string;


    @Prop({required:true})
    username: string;

    @Prop({required:true})
    password:string;

    @Prop({ enum:Role, default: Role.USER })
    roles?:Role
}

export const UserSchema = SchemaFactory.createForClass(User);