import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File, Fields, Files, Part } from "formidable";
import path from "path";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const category = req.query.category as string | undefined;

    const where = category ? { category } : undefined;

    const menus = await prisma.menu.findMany({ where });

    return res.status(200).json(menus);
  }

  if (req.method === "POST") {
    const form = formidable({
      uploadDir: path.join(process.cwd(), "/public/images"),
      keepExtensions: true,
      filename: (name: string, ext: string, part: Part) => {
        const timestamp = Date.now();
        return `${timestamp}_${part.originalFilename}`;
      },
    });

    form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
      if (err) return res.status(500).json({ error: "Upload error" });

      const name = fields.name?.[0];
      const price = parseInt(fields.price?.[0] || "0", 10);
      const category = fields.category?.[0];
      const image = files.image?.[0] as File;

      const validCategories = ["밥류", "면류", "음료류"] as const;
      const isValidCategory = category && validCategories.includes(category as typeof validCategories[number]);

      if (!name || !price || !isValidCategory || !image) {
        return res.status(400).json({ error: "Missing or invalid fields" });
      }

      const imagePath = `/images/${path.basename(image.filepath)}`;

      const newMenu = await prisma.menu.create({
        data: {
          name,
          price,
          category,
          imagePath,
        },
      });

      return res.status(200).json(newMenu);
    });
  }
  return res.status(405).json({ error: "Method Not Allowed" });

};

export default handler;
