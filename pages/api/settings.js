import { Admin } from "@/models/Admin";
import { adminEmails } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "GET") {
    res.json(await Admin.find());
  }

  if (method === "POST") {
    const { email } = req.body;
    const newAdmin = await Admin.create({ email });
    res.json(newAdmin);
  }

  if (method === "PUT") {
    const { _id, email } = req.body;
    await Admin.updateOne({ _id }, { email });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?._id) {
      await Admin.deleteOne({ _id: req.query?._id });
      res.json(true);
    }
  }
}
