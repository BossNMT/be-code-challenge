import { Types } from "mongoose";
import { SchemaOptions } from "@nestjs/mongoose";

export const Options: SchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (_, ret: any) {
      for (const [key, value] of Object.entries(ret)) {
        if (value instanceof Types.Decimal128) {
          ret[key] = value.toString();
        }
      }
      delete ret.id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: function (_, ret: any) {
      for (const [key, value] of Object.entries(ret)) {
        if (value instanceof Types.Decimal128) {
          ret[key] = value.toString();
        }
      }

      delete ret.__v;
      return ret;
    },
  },
};
