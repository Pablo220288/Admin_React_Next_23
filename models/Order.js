import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,
    paid: { type: Boolean },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Order = models.Order || model("Order", OrderSchema);