const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const cloudinary = require("cloudinary").v2;

// 🔐 SECRETS
const CLOUDINARY_CLOUD_NAME =
  defineSecret("CLOUDINARY_CLOUD_NAME");

const CLOUDINARY_API_KEY =
  defineSecret("CLOUDINARY_API_KEY");

const CLOUDINARY_API_SECRET =
  defineSecret("CLOUDINARY_API_SECRET");


// ======================================================
// XÓA ẢNH CLOUDINARY
// ======================================================

exports.deleteCloudinaryImages = onCall(
  {
    region: "us-central1",

    secrets: [
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET
    ]
  },

  async (request) => {

    // ==================================================
    // 1. CẤU HÌNH CLOUDINARY
    // ==================================================

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME.value(),
      api_key: CLOUDINARY_API_KEY.value(),
      api_secret: CLOUDINARY_API_SECRET.value()
    });


    // ==================================================
    // 2. NHẬN PUBLIC IDS TỪ FRONTEND
    // ==================================================

    const { public_ids } = request.data || {};

    console.log(
      "📥 Public IDs nhận được:",
      public_ids
    );


    // ==================================================
    // 3. KIỂM TRA DỮ LIỆU
    // ==================================================

    if (
      !Array.isArray(public_ids) ||
      public_ids.length === 0
    ) {
      throw new HttpsError(
        "invalid-argument",
        "public_ids phải là một mảng không rỗng"
      );
    }


    // ==================================================
    // 4. XÓA TỪNG ẢNH
    // ==================================================

    const results = [];

    for (const publicId of public_ids) {

      // Bỏ qua dữ liệu rỗng
      if (
        typeof publicId !== "string" ||
        publicId.trim() === ""
      ) {
        results.push({
          public_id: publicId,
          success: false,
          result: "invalid_public_id"
        });

        continue;
      }


      try {

        console.log(
          `🗑️ Đang xóa Cloudinary: ${publicId}`
        );


        const result =
          await cloudinary.uploader.destroy(
            publicId,
            {
              resource_type: "image",
              type: "upload"
            }
          );


        console.log(
          `☁️ Kết quả ${publicId}:`,
          result
        );


        results.push({
          public_id: publicId,
          success: result.result === "ok",
          result: result.result
        });


      } catch (error) {

        console.error(
          `❌ Lỗi xóa ${publicId}:`,
          error
        );


        results.push({
          public_id: publicId,
          success: false,
          result: "error",
          error: error.message
        });
      }
    }


    // ==================================================
    // 5. TRẢ KẾT QUẢ CHO FRONTEND
    // ==================================================

    return {
      success: true,
      results
    };
  }
);