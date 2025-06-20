import { json } from "@remix-run/node";
import prisma from "../db.server";
import cloudinary from "cloudinary";
import { z } from "zod";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ReviewSchema = z.object({
  productId: z.string().min(1),
  customerId:z.string().min(1), // Bắt buộc customerId
  rating: z.string().transform((val) => parseInt(val)).pipe(z.number().min(0).max(5)),
  content: z.string().min(1),
});

export const action = async ({ request }) => {
  try {
    const formData = await request.formData();

    const data = {
      productId: formData.get("productId"),
      customerId: formData.get("customerId"),
      rating: formData.get("rating"),
      content: formData.get("review"),
    };

    console.log("Dữ liệu nhận được:", data);

    const validatedData = ReviewSchema.parse(data);

    // Kiểm tra customerId trong bảng Customer
    const customer = await prisma.customer.findUnique({
      where: { customerId:"gid://shopify/Customer/" + validatedData.customerId },
    });
    if (!customer) {
      console.error(`Không tìm thấy customerId: ${validatedData.customerId}`);
      return json({ success: false, error: "Khách hàng không tồn tại" }, { status: 400 });
    }

    const images = formData.getAll("images");
    console.log("Tổng số ảnh nhận được:", images.length);

    const uploadedImages = [];

    for (const image of images) {
      if (image.size > 0) {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");
        const dataURI = `data:${image.type};base64,${base64Image}`;

        console.log("Đang upload ảnh lên Cloudinary...");

        try {
          const uploadResult = await cloudinary.v2.uploader.upload(dataURI, {
            folder: "reviews",
            resource_type: "image",
          });

          console.log("Ảnh đã upload:", uploadResult.secure_url);
          uploadedImages.push(uploadResult.secure_url);
        } catch (err) {
          console.error("Lỗi khi upload ảnh:", err);
        }
      } else {
        console.log("File rỗng, bỏ qua ảnh này");
      }
    }

    console.log("Danh sách URL ảnh đã upload:", uploadedImages);

    const review = await prisma.review.create({
      data: {
        productId: validatedData.productId,
        customerId: "gid://shopify/Customer/" + validatedData.customerId,
        rating: validatedData.rating,
        content: validatedData.content,
        images: {
          create: uploadedImages.map((url) => ({
            url,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Lỗi xử lý đánh giá:", error);
    if (error instanceof z.ZodError) {
      return json({ success: false, errors: error.errors }, { status: 400 });
    }
    return json({ success: false, error: "Không thể xử lý đánh giá" }, { status: 500 });
  }
};

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");

  if (!productId) {
    return json({ success: false, error: "Yêu cầu Product ID" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId, approved: true },
    select: {
      id: true,
      rating: true,
      content: true,
      createdAt: true,
      images: {
        select: { url: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return json({ success: true, reviews });
};