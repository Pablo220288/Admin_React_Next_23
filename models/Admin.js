import { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Admin = models?.Admin || model("Admin", AdminSchema);